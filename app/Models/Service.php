<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;

#[Fillable([ 'title', 'description', 'category', 'image' ])]
#[Hidden([ 'created_at', 'updated_at' ])]
class Service extends Model
{
    //
}
