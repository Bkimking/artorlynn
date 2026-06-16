<?php

use App\Http\Controllers\Admin\Site\BannerController;
use App\Http\Controllers\Admin\Site\ContactController;
use App\Http\Controllers\Admin\Site\FaqsController;
use App\Http\Controllers\Admin\Site\FounderController;
use App\Http\Controllers\Admin\Site\GalleryController;
use App\Http\Controllers\Admin\Site\HeroController;
use App\Http\Controllers\Admin\Site\NewsController;
use App\Http\Controllers\Admin\Site\PartnerController;
use App\Http\Controllers\Admin\Site\ServicesController;
use App\Http\Controllers\Admin\Site\TestimonialController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->prefix('admin/site')->name('admin.site.')->group(function () {
    // banners
    Route::get('/banners', [BannerController::class, 'index'])->name('banners');
    Route::post('/banners', [BannerController::class, 'store'])->name('banners.store');
    Route::put('/banners/{id}', [BannerController::class, 'update'])->name('banners.update');
    Route::delete('/banners/{id}', [BannerController::class, 'destroy'])->name('banners.destroy');
    // contacts
    Route::get('/contacts', [ContactController::class, 'index'])->name('contacts');
    Route::put('/contacts', [ContactController::class, 'update'])->name('contacts.update');
    // faqs
    Route::get('/faqs', [FaqsController::class, 'index'])->name('faqs');
    Route::post('/faqs', [FaqsController::class, 'store'])->name('faqs.store');
    Route::put('/faqs/{id}', [FaqsController::class, 'update'])->name('faqs.update');
    Route::delete('/faqs/{id}', [FaqsController::class, 'destroy'])->name('faqs.destroy');
    Route::post('/faqs/reorder', [FaqsController::class, 'reorder'])->name('faqs.reorder');
    // gallerys
    Route::get('/gallerys', [GalleryController::class, 'index'])->name('gallerys');
    Route::post('/gallerys', [GalleryController::class, 'store'])->name('gallerys.store');
    Route::put('/gallerys/{id}', [GalleryController::class, 'update'])->name('gallerys.update');
    Route::delete('/gallerys/{id}', [GalleryController::class, 'destroy'])->name('gallerys.destroy');
    // hero
    Route::get('/hero', [HeroController::class, 'index'])->name('hero');
    Route::put('/hero', [HeroController::class, 'update'])->name('hero.update');
    // news
    Route::get('/news', [NewsController::class, 'index'])->name('news');
    Route::post('/news', [NewsController::class, 'store'])->name('news.store');
    Route::put('/news/{id}', [NewsController::class, 'update'])->name('news.update');
    Route::delete('/news/{id}', [NewsController::class, 'destroy'])->name('news.destroy');
    // partners
    Route::get('/partners', [PartnerController::class, 'index'])->name('partners');
    Route::post('/partners', [PartnerController::class, 'store'])->name('partners.store');
    Route::put('/partners/{id}', [PartnerController::class, 'update'])->name('partners.update');
    Route::delete('/partners/{id}', [PartnerController::class, 'destroy'])->name('partners.destroy');
    // reviews/testimonials
    Route::get('/reviews', [TestimonialController::class, 'index'])->name('reviews');
    Route::post('/reviews', [TestimonialController::class, 'store'])->name('reviews.store');
    Route::put('/reviews/{id}', [TestimonialController::class, 'update'])->name('reviews.update');
    Route::delete('/reviews/{id}', [TestimonialController::class, 'destroy'])->name('reviews.destroy');
    // founder
    Route::get('/founder', [FounderController::class, 'index'])->name('founder');
    Route::put('/founder', [FounderController::class, 'update'])->name('founder.update');
    // services
    Route::get('/services', [ServicesController::class, 'index'])->name('services');
    Route::post('/services', [ServicesController::class, 'store'])->name('services.store');
    Route::put('/services/{id}', [ServicesController::class, 'update'])->name('services.update');
    Route::delete('/services/{id}', [ServicesController::class, 'destroy'])->name('services.destroy');
});
