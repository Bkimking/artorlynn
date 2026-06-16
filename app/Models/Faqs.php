<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;

#[Fillable([ 'question', 'answer', 'sorted_order', 'is_visible' ])]
#[Hidden([ 'created_at', 'updated_at' ])]
class Faqs extends Model
{
    //
}
