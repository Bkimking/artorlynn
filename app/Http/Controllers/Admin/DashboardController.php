<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Banner;
use App\Models\Contact;
use App\Models\ContactSubmission;
use App\Models\Event;
use App\Models\Faqs;
use App\Models\Founder;
use App\Models\Gallery;
use App\Models\Hero;
use App\Models\News;
use App\Models\Partner;
use App\Models\Product;
use App\Models\Service;
use App\Models\Testimonials;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Activitylog\Models\Activity;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        return Inertia::render('admin/dashboard', [
            'stats' => [
                'products' => Product::count(),
                'events' => Event::count(),
            ],
            'unread' => [
                'notifications' => $user->unreadNotifications()->limit(5)->get(),
                'notifications_count' => $user->unreadNotifications()->count(),
                'messages' => ContactSubmission::where('status', 'unread')->orderBy('created_at', 'desc')->limit(5)->get(),
                'messages_count' => ContactSubmission::where('status', 'unread')->count(),
            ],
            'site' => [
                'banners' => Banner::latest()->limit(3)->get(),
                'contacts' => Contact::limit(3)->get(),
                'faqs' => Faqs::latest()->limit(5)->get(),
                'hero' => Hero::latest()->first(),
                'galleries' => Gallery::latest()->limit(3)->get(),
                'news' => News::latest()->limit(3)->get(),
                'partners' => Partner::latest()->limit(5)->get(),
                'reviews' => Testimonials::latest()->limit(5)->get(),
                'services' => Service::latest()->limit(3)->get(),
                'founder' => Founder::latest()->first(),
            ],
            'activity_logs' => Activity::with('causer')
                ->latest()
                ->limit(15)
                ->get(),
        ]);
    }
}
