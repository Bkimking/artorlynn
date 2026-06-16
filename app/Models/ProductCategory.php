<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;

#[Fillable(['name', 'slug', 'description', 'cover_image', 'is_active'])]
#[Hidden(['created_at', 'updated_at'])]
class ProductCategory extends Model
{
    public function products()
    {
        return $this->hasMany(Product::class);
    }
}
