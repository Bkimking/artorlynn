<?php

namespace App\Http\Controllers;

use App\Models\Testimonials;
use App\Models\User;
use App\Notifications\NotificationType;
use App\Services\NotificationService;
use Illuminate\Http\Request;

class TestimonialController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'position' => 'nullable|string|max:255',
            'rating' => 'required|integer|min:1|max:5',
            'content' => 'nullable|string|max:1000',
            'avatar' => 'nullable|image|max:2048',
        ]);

        if (empty($validated['content'])) {
            $validated['content'] = ' '; // ensure not null if db requires text
        }

        if ($request->hasFile('avatar')) {
            $validated['avatar'] = $request->file('avatar')->store('testimonials', 'public');
        }

        $testimonial = Testimonials::create($validated);

        activity('site_testimonials')
            ->performedOn($testimonial)
            ->event('created')
            ->withProperties(['attributes' => $testimonial->toArray()])
            ->log('New public review submitted');

        // Notify admin
        $admin = User::first();
        if ($admin) {
            NotificationService::send(NotificationType::NEW_REVIEW, $admin, [
                'name'    => $testimonial->name,
                'email'   => $testimonial->email,
                'rating'  => $testimonial->rating,
                'content' => $testimonial->content,
            ]);
        }

        // Notify guest/submitter
        if ($testimonial->email) {
            NotificationService::send(NotificationType::REVIEW_CONFIRMATION, [
                'email' => $testimonial->email,
                'name'  => $testimonial->name,
            ], [
                'name'    => $testimonial->name,
                'rating'  => $testimonial->rating,
            ]);
        }

        return response()->json(['message' => 'Review submitted successfully!']);
    }
}
