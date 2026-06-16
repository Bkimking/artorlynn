<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;

#[Fillable([ 'name', 'position', 'content', 'avatar', 'facebook', 'twitter', 'instagram', 'linkedin', 'youtube', 'tiktok', 'telegram', 'whatsapp', 'website'])]
#[Hidden([ 'created_at', 'updated_at' ])]
class Founder extends Model
{
    //
}
