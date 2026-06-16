<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;

#[Fillable([ 'name', 'email', 'position', 'content', 'avatar', 'rating', 'is_featured', 'date' ])]
#[Hidden([ 'created_at', 'updated_at' ])]
class Testimonials extends Model
{
    //
}
