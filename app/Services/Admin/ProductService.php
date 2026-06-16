<?php

namespace App\Services\Admin;

class ProductService
{
    public function getAllProducts()
    {
        return Product::all();
    }
}