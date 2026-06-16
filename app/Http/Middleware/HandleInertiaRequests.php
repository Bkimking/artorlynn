<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use App\Models\ContactSubmission;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $request->user(),
 
                // ── Sidebar notification panel data ──────────────────────────
                // Unread DB notifications (bell icon panel)
                'notifications' => fn () => $request->user()
                    ? $request->user()
                        ->unreadNotifications()
                        ->latest()
                        ->take(20)
                        ->get()
                    : [],
 
                // Unread + recent contact submissions (mail icon panel)
                'submissions' => fn () => $request->user()
                    ? ContactSubmission::with(['replies' => function ($q) {
                        $q->orderBy('replied_at', 'asc');
                    }])
                        ->orderByRaw("FIELD(status, 'unread', 'read', 'replied', 'archived')")
                        ->orderBy('created_at', 'desc')
                        ->take(30)
                        ->get()
                    : [],
            ],
            'flash' => [
                'toast' => $request->session()->get('toast'),
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
        ];
    }
}
