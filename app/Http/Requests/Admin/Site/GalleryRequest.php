<?php

namespace App\Http\Requests\Admin\Site;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class GalleryRequest extends FormRequest
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
        $isUpdate = $this->isMethod('PUT') || $this->isMethod('PATCH');

        return [
            'name' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'is_featured' => 'boolean',
            'is_gif' => 'boolean',
            'is_visible' => 'boolean',
            'image' => 'nullable|image|max:10240',
            'video' => 'nullable|mimetypes:video/mp4,video/webm,video/quicktime|max:51200',
            'type' => 'nullable|in:image,gif,video',
        ];
    }
}
