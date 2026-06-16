<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProductStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Add proper authorization if needed
    }

    public function rules(): array
    {
        return [
            'product_category_id' => 'required|exists:product_categories,id',
            'title' => 'required|string|max:255',
            'slug' => 'required|string|unique:products,slug',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'compare_at_price' => 'nullable|numeric|min:0',
            'stock_quantity' => 'required|integer|min:0',
            'images' => 'nullable|array',
            'status' => ['required', Rule::in(['draft', 'published', 'out_of_stock'])],
            'is_featured' => 'boolean',
        ];
    }
}