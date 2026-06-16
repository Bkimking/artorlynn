<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactSubmission;
use App\Helpers\ToastHelper;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MessagesController extends Controller
{
    /**
     * Load all submissions sorted by last activity:
     * latest reply replied_at, or original created_at if no replies.
     */
    private function allSubmissions()
    {
        return ContactSubmission::with(['replies' => function ($q) {
            $q->orderBy('replied_at', 'asc');
        }])
            ->orderByRaw('
                GREATEST(
                    created_at,
                    COALESCE((
                        SELECT MAX(replied_at)
                        FROM contact_submission_replies
                        WHERE contact_submission_id = contact_submissions.id
                    ), created_at)
                ) DESC
            ')
            ->get();
    }

    /**
     * Pick the default submission to open: latest unread, else latest overall.
     * Collection is already sorted by last activity desc, so first() = most recent.
     */
    private function defaultSelected($submissions): ?ContactSubmission
    {
        return $submissions->firstWhere('status', 'unread') ?? $submissions->first();
    }

    public function index(): Response
    {
        $submissions = $this->allSubmissions();

        return Inertia::render('admin/messages/index', [
            'submissions' => $submissions,
            'selected'    => $this->defaultSelected($submissions),
        ]);
    }

    public function show(ContactSubmission $submission): Response
    {
        $submission->load(['replies' => function ($q) {
            $q->orderBy('replied_at', 'asc');
        }]);

        return Inertia::render('admin/messages/index', [
            'submissions' => $this->allSubmissions(),
            'selected'    => $submission,
        ]);
    }

    public function markRead(Request $request, ContactSubmission $submission): RedirectResponse
    {
        try {
            $submission->markRead();

            activity('messages')
                ->performedOn($submission)
                ->causedBy($request->user())
                ->event('marked_read')
                ->withProperties([
                    'msg_id'     => $submission->msg_id,
                    'from_email' => $submission->email,
                    'ip'         => $request->ip(),
                    'user_agent' => $request->userAgent(),
                ])
                ->log("Marked message from '{$submission->name}' ({$submission->email}) as read");

            return back()->with('toast', ToastHelper::success('Message marked as read.'));
        } catch (\Exception $e) {
            return back()->with('toast', ToastHelper::error('Failed to mark message as read: ' . $e->getMessage()));
        }
    }
}