<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class EventUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'slug' => ['required', 'string', Rule::unique('events')->ignore($this->event)],
            'description' => 'required|string',
            'event_date' => 'required|date',
            'location_name' => 'required|string|max:255',
            'google_maps_url' => 'nullable|url',
            'ticket_price' => 'required|numeric|min:0',
            'max_capacity' => 'nullable|integer|min:1',
            'tickets_sold' => 'nullable|integer|min:0',
            'images' => 'nullable|array',
            'status' => ['required', Rule::in(['draft', 'upcoming', 'past', 'cancelled'])],
            'registration_open' => 'boolean',
        ];
    }
}