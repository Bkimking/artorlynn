<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;

#[Fillable([ 'image', 'name', 'description', 'is_featured', 'type', 'video', 'is_gif', 'is_visible' ])]
#[Hidden([ 'created_at', 'updated_at' ])]
class Gallery extends Model
{
    protected $table = 'galleries';
}
