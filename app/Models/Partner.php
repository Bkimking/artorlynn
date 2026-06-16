<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;

#[Fillable([ 'name', 'logo', 'website_url', 'partnership_tier'])]
#[Hidden([ 'created_at', 'updated_at' ])]
class Partner extends Model
{
    //
}
