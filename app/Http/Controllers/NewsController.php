<?php

namespace App\Http\Controllers;

use App\Models\News;
use Inertia\Inertia;

class NewsController extends Controller
{
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