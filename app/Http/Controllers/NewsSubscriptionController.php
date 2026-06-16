<?php

namespace App\Http\Controllers;

use App\Http\Requests\NewsSubscriptionRequest;
use App\Http\Resources\NewsSubscriptionResource;
use App\Models\NewsSubscription;
use App\Models\User;
use App\Notifications\NotificationType;
use App\Services\NotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;

class NewsSubscriptionController extends Controller
{
    /**
     * Subscribe from the public newsletter form.
     * - If already active: return friendly message (no duplicate).
     * - If previously unsubscribed: reactivate.
     */
    public function store(NewsSubscriptionRequest $request): JsonResponse
    {
        $existing = NewsSubscription::where('email', $request->email)->first();
 
        if ($existing) {
            if ($existing->isActive()) {
                return response()->json([
                    'message' => 'You\'re already subscribed — watch your inbox!',
                ], 200);
            }
 
            // Reactivate
            $existing->update([
                'status'           => 'active',
                'name'             => $request->name ?? $existing->name,
                'unsubscribed_at'  => null,
                'subscribed_at'    => now(),
            ]);
 
            // TODO: dispatch SubscriptionReactivated notification event
            // event(new SubscriptionReactivated($existing));

            activity('news_subscriptions')
                ->performedOn($existing)
                ->event('updated')
                ->log('Reactivated news subscription');

            // Notify admin
            $admin = User::first();
            if ($admin) {
                NotificationService::send(NotificationType::NEWS_SUBSCRIBED, $admin, [
                    'email' => $existing->email,
                    'name'  => $existing->name,
                    'action'=> 'reactivated',
                ]);
            }
 
            return response()->json([
                'message' => 'Welcome back! You\'ve been re-subscribed.',
            ], 200);
        }
 
        $subscription = NewsSubscription::create($request->validated());
 
        // TODO: dispatch NewSubscription notification event
        // event(new NewSubscription($subscription));

        activity('news_subscriptions')
            ->performedOn($subscription)
            ->event('created')
            ->withProperties(['attributes' => $subscription->toArray()])
            ->log('New news subscription received');

        // Notify admin
        $admin = User::first();
        if ($admin) {
            NotificationService::send(NotificationType::NEWS_SUBSCRIBED, $admin, [
                'email' => $subscription->email,
                'name'  => $subscription->name,
                'action'=> 'new',
            ]);
        }
 
        return response()->json([
            'message' => 'You\'re in! Thanks for subscribing.',
        ], 201);
    }
 
    /**
     * One-click unsubscribe via token link (email footer link).
     * Returns a redirect — can point to a simple "You've been unsubscribed" page.
     */
    public function unsubscribe(string $token): RedirectResponse
    {
        $subscription = NewsSubscription::where('unsubscribe_token', $token)->firstOrFail();
 
        if ($subscription->isActive()) {
            $subscription->unsubscribe();
        }
 
        return redirect('/')->with('flash', 'You have been unsubscribed successfully.');
    }
 
    /**
     * Admin: list all subscriptions.
     */
    public function index(): JsonResponse
    {
        $subscriptions = NewsSubscription::query()
            ->when(request('status'), fn ($q, $s) => $q->where('status', $s))
            ->orderByDesc('subscribed_at')
            ->paginate(30);
 
        return response()->json(NewsSubscriptionResource::collection($subscriptions)->response()->getData(true));
    }
}
