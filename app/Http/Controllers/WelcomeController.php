<?php

// app/Http/Controllers/WelcomeController.php

namespace App\Http\Controllers;

use App\Models\Banner;
use App\Models\Contact;
use App\Models\Event;
use App\Models\Faqs;
use App\Models\Founder;
use App\Models\Hero;
use App\Models\News;
use App\Models\Partner;
use App\Models\Product;
use App\Models\Service;
use App\Models\Testimonials;
use Inertia\Inertia;

class WelcomeController extends Controller
{
    public function index()
    {
        $banners = Banner::where('is_visible', true)->orderBy('id')->get(['id', 'text', 'subtext', 'type']);
        $faqs = Faqs::where('is_visible', true)->orderBy('sorted_order')->get(['id', 'question', 'answer']);
        $hero = Hero::first();
        $partners = Partner::whereNotNull('partnership_tier')->orderBy('name')->get(['id', 'name', 'logo', 'website_url']);

        // Services – no visibility field, fetch all
        $services = Service::all();

        // Events
        $events = Event::where('status', 'upcoming')
            ->orderBy('event_date', 'asc')
            ->get()
            ->map(function ($event) {
                $event->images = collect($event->images ?? [])->map(fn ($img) => asset('storage/'.$img))->values()->all();

                return $event;
            });

        // Products
        $products = Product::where('status', 'published')
            ->with('productCategory')
            ->get()
            ->map(function ($product) {
                $product->images = collect($product->images ?? [])->map(fn ($img) => asset('storage/'.$img))->values()->all();

                return $product;
            });

        // Founder – single record
        $founder = Founder::first();

        // Testimonials – only featured ones
        $testimonials = Testimonials::where('is_featured', true)->get();

        // news
        $featuredNews = News::where('is_published', true)->where('is_featured', true)->orderBy('published_date', 'desc')->get();
        $latestNews = News::where('is_published', true)->where('is_featured', false)->orderBy('published_date', 'desc')->limit(3)->get();

        // Contact – single record
        $contact = Contact::first();

        return Inertia::render('welcome', [
            'banners' => $banners,
            'faqs' => $faqs,
            'hero' => $hero,
            'partners' => $partners,
            'services' => $services,
            'events' => $events,
            'products' => $products,
            'founder' => $founder,
            'testimonials' => $testimonials,
            'news' => [
                'featured' => $featuredNews,
                'latest' => $latestNews,
            ],
            'contact' => $contact,
        ]);
    }
}
