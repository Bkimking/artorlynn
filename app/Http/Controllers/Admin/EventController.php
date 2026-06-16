<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\EventStoreRequest;
use App\Http\Requests\Admin\EventUpdateRequest;
use App\Http\Resources\EventResource;
use App\Models\Event;
use App\Helpers\ToastHelper;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EventController extends Controller
{
    public function index(Request $request)
    {
        $events = Event::orderBy('event_date', 'desc')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('admin/events/index', [
            'events' => EventResource::collection($events),
            'filters' => $request->only(['search', 'status', 'date_range']),
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/events/create');
    }

    public function store(EventStoreRequest $request)
    {
        try {
            $data = $request->validated();
            
            if ($request->hasFile('images')) {
                $imagePaths = [];
                foreach ($request->file('images') as $image) {
                    $imagePaths[] = $image->store('events', 'public');
                }
                $data['images'] = $imagePaths;
            }

            $event = Event::create($data);

            activity('events')
                ->performedOn($event)
                ->causedBy($request->user())
                ->event('created')
                ->withProperties([
                    'attributes' => $event->getAttributes(),
                    'ip' => $request->ip(),
                    'user_agent' => $request->userAgent(),
                ])
                ->log("Created event '{$event->title}'");

            return redirect()->route('events.index')->with('toast', ToastHelper::success('Event created successfully.'));
        } catch (\Exception $e) {
            return redirect()->back()->withInput()->with('toast', ToastHelper::error('Failed to create event: ' . $e->getMessage()));
        }
    }

    public function edit(Event $event)
    {
        return Inertia::render('admin/events/edit', [
            'event' => new EventResource($event)
        ]);
    }

    public function update(EventUpdateRequest $request, Event $event)
    {
        try {
            $data = $request->validated();
            $oldAttributes = $event->getAttributes();

            // Support image removal and appending new ones
            $existingImages = $request->input('existing_images', []);
            $newImages = [];

            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $image) {
                    $newImages[] = $image->store('events', 'public');
                }
            }

            $data['images'] = array_merge($existingImages, $newImages);

            $event->update($data);

            activity('events')
                ->performedOn($event)
                ->causedBy($request->user())
                ->event('updated')
                ->withProperties([
                    'old' => $oldAttributes,
                    'attributes' => $event->getAttributes(),
                    'ip' => $request->ip(),
                    'user_agent' => $request->userAgent(),
                ])
                ->log("Updated event '{$event->title}'");

            return redirect()->route('events.index')->with('toast', ToastHelper::success('Event updated successfully.'));
        } catch (\Exception $e) {
            return redirect()->back()->withInput()->with('toast', ToastHelper::error('Failed to update event: ' . $e->getMessage()));
        }
    }

    public function destroy(Event $event)
    {
        try {
            $eventData = $event->toArray();
            $event->delete();

            activity('events')
                ->performedOn($event)
                ->causedBy(request()->user())
                ->event('deleted')
                ->withProperties([
                    'deleted_data' => $eventData,
                    'ip' => request()->ip(),
                    'user_agent' => request()->userAgent(),
                ])
                ->log("Deleted event '{$event->title}'");

            return redirect()->back()->with('toast', ToastHelper::success('Event deleted successfully.'));
        } catch (\Exception $e) {
            return redirect()->back()->with('toast', ToastHelper::error('Failed to delete event: ' . $e->getMessage()));
        }
    }
}