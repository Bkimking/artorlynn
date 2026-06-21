<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\EventAttendeeRequest;
use App\Http\Resources\EventAttendeeResource;
use App\Models\Event;
use App\Models\EventAttendee;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Mail;
use App\Mail\SendTicketMail;

class EventAttendeeController extends Controller
{
    public function index(Event $event)
    {
        $attendees = $event->attendees()->latest()->paginate(20);
        
        return Inertia::render('admin/events/attendee', [
            'event' => $event,
            'attendees' => EventAttendeeResource::collection($attendees),
        ]);
    }

    public function store(EventAttendeeRequest $request, Event $event)
    {
        // Capacity guard
        if ($event->max_capacity && $event->tickets_sold >= $event->max_capacity) {
            return back()->withErrors(['message' => 'Event is full. Cannot add more attendees.']);
        }

        $attendee = $event->attendees()->create($request->validated());

        // Send ticket mail
        try {
            Mail::to($attendee->email)->send(new SendTicketMail($attendee));
        } catch (\Exception $e) {
            // Log error or handle gracefully
            \Log::error("Failed to send ticket mail to {$attendee->email}: " . $e->getMessage());
        }

        return back()->with('success', 'Attendee added successfully.');
    }

    public function update(EventAttendeeRequest $request, EventAttendee $attendee)
    {
        $attendee->update($request->validated());
        return back()->with('success', 'Attendee updated successfully.');
    }

    public function destroy(EventAttendee $attendee)
    {
        $attendee->delete();
        return back()->with('success', 'Attendee removed successfully.');
    }

    /**
     * Look up attendee by ticket_id (for scanning)
     */
    public function show($ticket_id)
    {
        $attendee = EventAttendee::where('ticket_id', $ticket_id)->with('event')->firstOrFail();
        return response()->json(new EventAttendeeResource($attendee));
    }

    /**
     * Mark attendee as checked in
     */
    public function checkIn($ticket_id)
    {
        $attendee = EventAttendee::where('ticket_id', $ticket_id)->firstOrFail();

        if ($attendee->checked_in) {
            $message = "Already checked in at {$attendee->checked_in_at->format('Y-m-d H:i:s')}";
            
            if (request()->wantsJson()) {
                return response()->json(['success' => false, 'message' => $message], 422);
            }
            
            return back()->with('error', $message);
        }

        $attendee->update([
            'checked_in' => true,
            'checked_in_at' => now(),
        ]);

        $message = 'Check-in successful!';

        if (request()->wantsJson()) {
            return response()->json(['success' => true, 'message' => $message]);
        }

        return back()->with('success', $message);
    }
}
