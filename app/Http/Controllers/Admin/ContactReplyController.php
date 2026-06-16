<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactSubmission;
use App\Models\ContactSubmissionReply;
use App\Notifications\NotificationType;
use App\Helpers\ToastHelper;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use App\Notifications\Channels\MailChannel;

class ContactReplyController extends Controller
{
    public function store(Request $request, ContactSubmission $submission): RedirectResponse
    {
        $request->validate([
            'body' => ['required', 'string', 'min:2'],
        ]);

        try {
            // Save outbound reply
            $reply = ContactSubmissionReply::create([
                'contact_submission_id' => $submission->id,
                'msg_id'                => $submission->msg_id,
                'direction'             => 'outbound',
                'body'                  => $request->body,
                'sender_email'          => config('mail.from.address'),
                'replied_at'            => now(),
            ]);

            // Mark submission as replied
            $submission->markReplied($request->body);

            // Fire email to customer
            MailChannel::send($submission->email, NotificationType::CONTACT_REPLY, [
                'name'       => $submission->name,
                'msg_id'     => $submission->msg_id,
                'reply_body' => $request->body,
            ]);

            activity('contact_replies')
                ->performedOn($submission)
                ->causedBy($request->user())
                ->event('replied')
                ->withProperties([
                    'reply_id'    => $reply->id,
                    'msg_id'      => $submission->msg_id,
                    'to_email'    => $submission->email,
                    'ip'          => $request->ip(),
                    'user_agent'  => $request->userAgent(),
                ])
                ->log("Replied to contact submission from '{$submission->name}' ({$submission->email})");

            return back()->with('toast', ToastHelper::success('Reply sent successfully.'));
        } catch (\Exception $e) {
            return back()->with('toast', ToastHelper::error('Failed to send reply: ' . $e->getMessage()));
        }
    }
}