<?php

namespace App\Http\Requests\Admin\Site;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class HeroRequest extends FormRequest
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
            'description' => 'nullable|string',
            'existing_images' => 'nullable|string',
            'images' => 'nullable|array',
            'images.*' => 'image|max:10240',
            'alts' => 'nullable|array',
            'alts.*' => 'nullable|string|max:255',
        ];
    }
}
