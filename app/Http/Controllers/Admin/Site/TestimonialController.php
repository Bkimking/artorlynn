<?php

namespace App\Http\Controllers\Admin\Site;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Site\TestimonialRequest;
use App\Models\Testimonials;
use App\Models\User;
use App\Notifications\NotificationType;
use App\Services\NotificationService;
use App\Services\Admin\site\TestimonialService;
use App\Helpers\ToastHelper;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TestimonialController extends Controller
{
    protected $service;

    public function __construct(TestimonialService $service)
    {
        $this->service = $service;
    }

    public function index()
    {
        $reviews = $this->service->getAll();
        return Inertia::render('admin/site/reviews', [
            'reviews' => $reviews->resolve(),
        ]);
    }

    public function store(TestimonialRequest $request)
    {
        try {
            $review = $this->service->create($request->except('avatar'), $request->file('avatar'));

            activity('site_testimonials')
                ->performedOn($review->resource)
                ->causedBy($request->user())
                ->event('created')
                ->withProperties(['attributes' => $review->resource->toArray()])
                ->log("Created testimonial from '{$review->name}'");

            // Notify admin
            NotificationService::send(NotificationType::NEW_REVIEW, $request->user(), [
                'name'    => $review->name,
                'rating'  => $review->rating,
                'content' => $review->content,
            ]);

            return redirect()->back()->with('toast', ToastHelper::success('Review added.'));
        } catch (\Exception $e) {
            return redirect()->back()->with('toast', ToastHelper::error('Failed: ' . $e->getMessage()));
        }
    }

    public function update($id, TestimonialRequest $request)
    {
        try {
            $review = $this->service->update($id, $request->except('avatar'), $request->file('avatar'));

            activity('site_testimonials')
                ->performedOn($review->resource)
                ->causedBy($request->user())
                ->event('updated')
                ->withProperties(['attributes' => $review->resource->toArray()])
                ->log("Updated testimonial from '{$review->name}'");

            return redirect()->back()->with('toast', ToastHelper::success('Review updated.'));
        } catch (\Exception $e) {
            return redirect()->back()->with('toast', ToastHelper::error('Failed: ' . $e->getMessage()));
        }
    }

    public function destroy($id, Request $request)
    {
        try {
            $review = Testimonials::findOrFail($id);
            $this->service->delete($id);

            activity('site_testimonials')
                ->performedOn($review)
                ->causedBy($request->user())
                ->event('deleted')
                ->withProperties(['deleted_data' => $review->toArray()])
                ->log("Deleted testimonial from '{$review->name}'");

            return redirect()->back()->with('toast', ToastHelper::success('Review deleted.'));
        } catch (\Exception $e) {
            return redirect()->back()->with('toast', ToastHelper::error('Failed: ' . $e->getMessage()));
        }
    }
}