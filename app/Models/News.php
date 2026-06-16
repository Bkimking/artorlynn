<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;

#[Fillable([ 'title', 'content', 'category', 'image', 'is_featured', 'is_published', 'published_date' ])]
#[Hidden([ 'created_at', 'updated_at' ])]
class News extends Model
{
    //
}
