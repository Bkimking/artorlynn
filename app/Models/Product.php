<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;

#[Fillable(['product_category_id', 'title', 'slug', 'description', 'price', 'compare_at_price', 'stock_quantity', 'images', 'status', 'is_featured',])]
#[Hidden(['created_at', 'updated_at'])]

class Product extends Model
{
    protected $casts = [
        'images' => 'array',
    ];

    public function productCategory()
    {
        return $this->belongsTo(ProductCategory::class, 'product_category_id');
    }
}
