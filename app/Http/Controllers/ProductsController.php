<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Inertia\Inertia;

class ProductsController extends Controller
{
    public function index()
    {
        $products = Product::where('status', 'published')
            ->with('productCategory')
            ->get()
            ->map(function ($product) {
                $product->images = collect($product->images ?? [])
                    ->map(fn ($img) => asset('storage/'.$img))
                    ->values()
                    ->all();
                return $product;
            });

        return Inertia::render('public/products/index', [
            'products' => $products,
        ]);
    }

    public function show($slug)
    {
        $product = Product::where('slug', $slug)
            ->with('productCategory')
            ->firstOrFail();
        $product->images = collect($product->images ?? [])
            ->map(fn ($img) => asset('storage/'.$img))
            ->values()
            ->all();

        return Inertia::render('public/products/index-details', [
            'product' => $product,
        ]);
    }
}