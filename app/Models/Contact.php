<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;

#[Fillable([ 'email_1', 'email_2', 'email_3', 'phone_1', 'phone_2', 'phone_3', 'country', 'county', 'city', 'street_address', 'map_embed_url', 'about_location', 'facebook', 'twitter', 'instagram', 'linkedin', 'youtube', 'tiktok', 'telegram', 'whatsapp' ])]
#[Hidden([ 'created_at', 'updated_at' ])]
class Contact extends Model
{
    //
}
