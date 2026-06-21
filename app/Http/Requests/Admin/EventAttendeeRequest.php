<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class EventAttendeeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'amount_paid' => 'required|numeric|min:0',
            'status' => 'required|in:confirmed,cancelled,refunded',
            'notes' => 'nullable|string',
        ];
    }
}
