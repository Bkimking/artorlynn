<?php

namespace App\Http\Requests\Admin\Site;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class NewsRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:news,slug',
            'content' => 'required|string',
            'category' => 'nullable|string|max:100',
            'is_featured' => 'boolean',
            'is_published' => 'boolean',
            'published_date' => 'nullable|date',
            'image' => 'nullable|image|max:5120', // for store; update makes optional
        ];
    }
}
