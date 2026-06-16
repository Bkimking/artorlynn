<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\NotificationPreference;
use App\Notifications\NotificationType;
use App\Helpers\ToastHelper;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NotificationController extends Controller
{
    /**
     * Display a listing of personal notifications.
     */
    public function index(Request $request)
    {
        return Inertia::render('admin/notifications/index', [
            'notifications' => $request->user()->notifications()->paginate(20),
        ]);
    }

    /**
     * Mark a notification as read.
     */
    public function markAsRead(Request $request, string $id)
    {
        try {
            $notification = $request->user()->unreadNotifications()->findOrFail($id);
            $notification->markAsRead();

            activity('notifications')
                ->causedBy($request->user())
                ->event('marked_read')
                ->withProperties([
                    'notification_id' => $id,
                    'ip'              => $request->ip(),
                    'user_agent'      => $request->userAgent(),
                ])
                ->log("Marked notification '{$id}' as read");

            return redirect()->back()->with('toast', ToastHelper::success('Notification marked as read.'));
        } catch (\Exception $e) {
            return redirect()->back()->with('toast', ToastHelper::error('Failed to mark notification as read: ' . $e->getMessage()));
        }
    }

    /**
     * Mark all notifications as read.
     */
    public function markAllAsRead(Request $request)
    {
        try {
            $count = $request->user()->unreadNotifications->count();
            $request->user()->unreadNotifications->markAsRead();

            activity('notifications')
                ->causedBy($request->user())
                ->event('marked_all_read')
                ->withProperties([
                    'count'      => $count,
                    'ip'         => $request->ip(),
                    'user_agent' => $request->userAgent(),
                ])
                ->log("Marked all {$count} notifications as read");

            return redirect()->back()->with('toast', ToastHelper::success('All notifications marked as read.'));
        } catch (\Exception $e) {
            return redirect()->back()->with('toast', ToastHelper::error('Failed to mark all notifications as read: ' . $e->getMessage()));
        }
    }

    /**
     * Show notification settings.
     */
    public function settings(Request $request)
    {
        $user = $request->user();
        $types = NotificationType::all();
        
        // Get existing preferences
        $preferences = NotificationPreference::where('user_id', $user->id)
            ->get()
            ->keyBy('notification_type');

        $formattedSettings = collect($types)->map(function($type) use ($preferences) {
            return [
                'type'     => $type,
                'label'    => NotificationType::label($type),
                'channels' => $preferences->has($type) 
                    ? $preferences[$type]->channels 
                    : NotificationType::channels($type)
            ];
        });

        return Inertia::render('admin/notifications/settings', [
            'settings' => $formattedSettings,
        ]);
    }

    /**
     * Update notification preferences.
     */
    public function updateSettings(Request $request)
    {
        $validated = $request->validate([
            'settings'           => 'required|array',
            'settings.*.type'    => 'required|string',
            'settings.*.channels' => 'required|array',
        ]);

        try {
            foreach ($validated['settings'] as $setting) {
                NotificationPreference::updateOrCreate(
                    [
                        'user_id'           => $request->user()->id,
                        'notification_type' => $setting['type'],
                    ],
                    [
                        'channels' => $setting['channels'],
                    ]
                );
            }

            activity('notifications')
                ->causedBy($request->user())
                ->event('settings_updated')
                ->withProperties([
                    'updated_types' => collect($validated['settings'])->pluck('type')->toArray(),
                    'ip'            => $request->ip(),
                    'user_agent'    => $request->userAgent(),
                ])
                ->log("Updated notification preferences");

            return redirect()->back()->with('toast', ToastHelper::success('Notification preferences updated.'));
        } catch (\Exception $e) {
            return redirect()->back()->with('toast', ToastHelper::error('Failed to update preferences: ' . $e->getMessage()));
        }
    }
}