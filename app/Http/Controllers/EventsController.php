<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EventsController extends Controller
{
    public function index()
    {
        $events = Event::where('status', 'upcoming')
            ->orderBy('event_date', 'asc')
            ->get()
            ->map(function ($event) {
                $event->images = collect($event->images ?? [])
                    ->map(fn ($img) => asset('storage/'.$img))
                    ->values()
                    ->all();
                return $event;
            });

        return Inertia::render('public/events/index', [
            'events' => $events,
        ]);
    }

    public function show($slug)
    {
        $event = Event::where('slug', $slug)->firstOrFail();
        $event->images = collect($event->images ?? [])
            ->map(fn ($img) => asset('storage/'.$img))
            ->values()
            ->all();

        return Inertia::render('public/events/index-details', [
            'event' => $event,
        ]);
    }
}