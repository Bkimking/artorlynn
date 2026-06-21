<?php

namespace App\Observers;

use App\Models\EventAttendee;

class EventAttendeeObserver
{
    /**
     * Handle the EventAttendee "created" event.
     */
    public function created(EventAttendee $eventAttendee): void
    {
        $eventAttendee->event()->increment('tickets_sold');
    }

    /**
     * Handle the EventAttendee "updated" event.
     */
    public function updated(EventAttendee $eventAttendee): void
    {
        if ($eventAttendee->wasChanged('status')) {
            $oldStatus = $eventAttendee->getOriginal('status');
            $newStatus = $eventAttendee->status;

            if ($oldStatus === 'confirmed' && in_array($newStatus, ['cancelled', 'refunded'])) {
                $eventAttendee->event()->decrement('tickets_sold');
            } elseif (in_array($oldStatus, ['cancelled', 'refunded']) && $newStatus === 'confirmed') {
                $eventAttendee->event()->increment('tickets_sold');
            }
        }
    }

    /**
     * Handle the EventAttendee "deleted" event.
     */
    public function deleted(EventAttendee $eventAttendee): void
    {
        if ($eventAttendee->status === 'confirmed') {
            $eventAttendee->event()->decrement('tickets_sold');
        }
    }
}
