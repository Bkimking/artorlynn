<?php

use App\Http\Controllers\ActivityLogController;
use App\Http\Controllers\Admin\ContactReplyController;
use App\Http\Controllers\Admin\EventAttendeeController;
use App\Http\Controllers\Admin\EventController;
use App\Http\Controllers\Admin\MessagesController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\NotificationController;
use App\Http\Controllers\ContactSubmissionController;
use App\Http\Controllers\NewsSubscriptionController;
use App\Http\Controllers\TestimonialController;
use App\Http\Controllers\WelcomeController;
use App\Http\Controllers\EventsController;
use App\Http\Controllers\NewsController;
use App\Http\Controllers\ProductsController;
use App\Http\Controllers\Admin\AdminController;
use Illuminate\Support\Facades\Route;

Route::get('/', [WelcomeController::class, 'index'])->name('home');

// Public routes
Route::get('/events', [EventsController::class, 'index'])->name('events.public');
Route::get('/events/{slug}', [EventsController::class, 'show'])->name('events.publicshow');

Route::get('/news', [NewsController::class, 'index'])->name('news.public');
Route::get('/news/{id}', [NewsController::class, 'show'])->name('news.publicshow');

Route::get('/products', [ProductsController::class, 'index'])->name('products.public');
Route::get('/products/{slug}', [ProductsController::class, 'show'])->name('products.publicshow');

// Contact form submission
Route::post('/contact', [ContactSubmissionController::class, 'store'])
    ->name('contact.store');

// Newsletter subscription
Route::post('/newsletter/subscribe', [NewsSubscriptionController::class, 'store'])
    ->name('newsletter.subscribe');

// Public Testimonial Submission
Route::post('/testimonials', [TestimonialController::class, 'store'])
    ->name('testimonials.store');

Route::middleware(['auth', 'verified'])->prefix('admin')->group(function () {
    Route::inertia('dashboard', 'admin/dashboard')->name('dashboard');

    // Activity logs
    Route::get('/logs', [ActivityLogController::class, 'index'])->name('logs.index');
    Route::get('/logs/filter', [ActivityLogController::class, 'filter'])->name('logs.filter');

    // Notifications Center
    Route::prefix('notifications')->name('notifications.')->group(function () {
        Route::get('/', [NotificationController::class, 'index'])->name('index');
        Route::post('/{id}/read', [NotificationController::class, 'markAsRead'])->name('read');
        Route::post('/read-all', [NotificationController::class, 'markAllAsRead'])->name('read-all');
        Route::get('/settings', [NotificationController::class, 'settings'])->name('settings');
        Route::post('/settings', [NotificationController::class, 'updateSettings'])->name('settings.update');
    });

    // Product categories (additional API-like endpoints)
    Route::prefix('products')->name('products.')->group(function () {
        Route::get('categories', [ProductController::class, 'categories'])->name('categories');
        Route::post('categories', [ProductController::class, 'storeCategory'])->name('categories.store');
        Route::put('categories/{id}', [ProductController::class, 'updateCategory'])->name('categories.update');
        Route::delete('categories/{id}', [ProductController::class, 'deleteCategory'])->name('categories.delete');
    });

    // Products (full resource)
    Route::resource('products', ProductController::class);

    // Events (full resource)
    Route::resource('events', EventController::class);

    // Attendees
    Route::get('events/{event}/attendees', [EventAttendeeController::class, 'index'])->name('events.attendees');
    Route::post('events/{event}/attendees', [EventAttendeeController::class, 'store'])->name('events.attendees.store');
    Route::put('attendees/{attendee}', [EventAttendeeController::class, 'update'])->name('attendees.update');
    Route::delete('attendees/{attendee}', [EventAttendeeController::class, 'destroy'])->name('attendees.destroy');
    
    // Scan & Check-in
    Route::get('check-in/{ticket_id}', [EventAttendeeController::class, 'show'])->name('checkin.show');
    Route::post('check-in/{ticket_id}', [EventAttendeeController::class, 'checkIn'])->name('checkin.post');

    // Contact Reply (admin reply to contact submission)
    Route::post('contacts/{submission}/reply', [ContactReplyController::class, 'store'])
        ->name('contacts.reply');

    // messages
    Route::get('messages', [MessagesController::class, 'index'])->name('messages.index');
    Route::get('messages/{submission}', [MessagesController::class, 'show'])->name('messages.show');
    Route::post('messages/{submission}/read', [MessagesController::class, 'markRead'])->name('messages.read');

    // admins
    Route::resource('admins', AdminController::class);
});

require __DIR__.'/site.php';
require __DIR__.'/settings.php';
