<?php

namespace App\Services\Admin;

class EventService
{
    public function getAllEvents()
    {
        return Event::all();
    }
}