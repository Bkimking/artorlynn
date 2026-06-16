<?php

namespace App\Http\Controllers;

use App\Http\Requests\ContactSubmissionRequest;
use App\Http\Resources\ContactSubmissionResource;
use App\Models\ContactSubmission;
use App\Models\User;
use App\Notifications\NotificationType;
use App\Services\NotificationService;
use Illuminate\Http\JsonResponse;

class ContactSubmissionController extends Controller
{
    /**
     * Store a new contact submission from the public form.
     * msg_id is auto-generated in the model's booted() hook.
     */
    public function store(ContactSubmissionRequest $request): JsonResponse
    {
        $submission = ContactSubmission::create($request->validated());
 
        // Notify admin (database + mail)
        $admin = User::first(); // Flynn — sole admin
        if ($admin) {
            NotificationService::send(NotificationType::CONTACT_MESSAGE, $admin, [
                'name'    => $submission->name,
                'email'   => $submission->email,
                'service' => $submission->service,
                'msg_id'  => $submission->msg_id,
            ]);
        }

        // Auto-reply to guest (mail only)
        NotificationService::send(NotificationType::CONTACT_AUTO_REPLY, [
            'email' => $submission->email,
            'name'  => $submission->name,
        ], [
            'name'   => $submission->name,
            'msg_id' => $submission->msg_id,
        ]);

        activity('contact_submissions')
            ->performedOn($submission)
            ->event('created')
            ->withProperties(['attributes' => $submission->toArray()])
            ->log('New contact submission received');
 
        return response()->json([
            'message' => 'Your message has been received. We\'ll be in touch soon!',
            'msg_id'  => $submission->msg_id,
        ], 201);
    }
 
    /**
     * Admin: list all submissions, filterable by status.
     */
    public function index(): JsonResponse
    {
        $submissions = ContactSubmission::query()
            ->when(request('status'), fn ($q, $s) => $q->where('status', $s))
            ->orderByRaw("FIELD(status, 'unread', 'read', 'replied', 'archived')")
            ->orderByDesc('created_at')
            ->paginate(20);
 
        return response()->json(ContactSubmissionResource::collection($submissions)->response()->getData(true));
    }
 
    /**
     * Admin: view a single submission and auto-mark as read.
     */
    public function show(ContactSubmission $contactSubmission): JsonResponse
    {
        if ($contactSubmission->status === 'unread') {
            $contactSubmission->markRead();
        }
 
        return response()->json(new ContactSubmissionResource($contactSubmission));
    }
 
    /**
     * Admin: update status / add reply note.
     */
    public function update(ContactSubmission $contactSubmission): JsonResponse
    {
        $data = request()->validate([
            'status'     => ['sometimes', 'in:unread,read,replied,archived'],
            'reply_note' => ['nullable', 'string', 'max:5000'],
        ]);
 
        if (($data['status'] ?? null) === 'replied') {
            $contactSubmission->markReplied($data['reply_note'] ?? null);
        } else {
            $contactSubmission->update($data);
        }
 
        return response()->json(new ContactSubmissionResource($contactSubmission->fresh()));
    }
}
