<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;

#[Fillable([ 'title', 'slug', 'description', 'event_date', 'location_name', 'google_maps_url', 'ticket_price', 'max_capacity', 'tickets_sold', 'images', 'status', 'registration_open' ])]
#[Hidden([ 'created_at', 'updated_at' ])]

class Event extends Model
{
    protected $casts = [
        'event_date' => 'datetime',
        'images' => 'array',
    ];
}
