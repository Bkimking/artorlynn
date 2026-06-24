<?php

namespace App\Http\Controllers;

use App\Models\News;
use Inertia\Inertia;

class NewsController extends Controller
{
    public function index()
    {
        $news = News::where('is_published', true)
            ->orderBy('published_date', 'desc')
            ->get()
            ->map(function ($item) {
                if ($item->image) {
                    $item->image = asset('storage/'.$item->image);
                }
                return $item;
            });

        return Inertia::render('public/news/index', [
            'news' => $news,
        ]);
    }

    public function show($id)
    {
        $item = News::where('id', $id)->where('is_published', true)->firstOrFail();
        if ($item->image) {
            $item->image = asset('storage/'.$item->image);
        }
        return Inertia::render('public/news/index-details', [
            'news' => $item,
        ]);
    }
}