<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ProductStoreRequest;
use App\Http\Requests\Admin\ProductUpdateRequest;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use App\Models\ProductCategory;
use App\Helpers\ToastHelper;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    /**
     * Display a listing of products (with modal creation/editing in mind).
     */
    public function index(Request $request)
    {
        $products = Product::with('productCategory')
            ->orderBy('created_at', 'desc')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('admin/products/index', [
            'products' => ProductResource::collection($products),
            'filters' => $request->only(['search', 'status', 'category_id']),
        ]);
    }

    /**
     * Show the form for creating a new product.
     */
    public function create()
    {
        $categories = ProductCategory::where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('admin/products/create', [
            'categories' => $categories
        ]);
    }

    /**
     * Store a newly created product.
     */
    public function store(ProductStoreRequest $request)
    {
        try {
            $data = $request->validated();
            
            if ($request->hasFile('images')) {
                $imagePaths = [];
                foreach ($request->file('images') as $image) {
                    $imagePaths[] = $image->store('products', 'public');
                }
                $data['images'] = $imagePaths;
            }

            $product = Product::create($data);

            activity('products')
                ->performedOn($product)
                ->causedBy($request->user())
                ->event('created')
                ->withProperties([
                    'attributes' => $product->getAttributes(),
                    'ip' => $request->ip(),
                    'user_agent' => $request->userAgent(),
                ])
                ->log("Created product '{$product->title}'");

            return redirect()->route('products.index')->with('toast', ToastHelper::success('Product created successfully.'));
        } catch (\Exception $e) {
            return redirect()->back()->withInput()->with('toast', ToastHelper::error('Failed to create product: ' . $e->getMessage()));
        }
    }

    /**
     * Show the form for editing the specified product.
     */
    public function edit(Product $product)
    {
        $categories = ProductCategory::where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('admin/products/edit', [
            'product' => new ProductResource($product),
            'categories' => $categories
        ]);
    }
    public function update(ProductUpdateRequest $request, Product $product)
    {
        try {
            $data = $request->validated();
            $oldAttributes = $product->getAttributes();

            // Support image removal and appending new ones
            $existingImages = $request->input('existing_images', []);
            $newImages = [];

            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $image) {
                    $newImages[] = $image->store('products', 'public');
                }
            }

            $data['images'] = array_merge($existingImages, $newImages);

            $product->update($data);

            activity('products')
                ->performedOn($product)
                ->causedBy($request->user())
                ->event('updated')
                ->withProperties([
                    'old' => $oldAttributes,
                    'attributes' => $product->getAttributes(),
                    'ip' => $request->ip(),
                    'user_agent' => $request->userAgent(),
                ])
                ->log("Updated product '{$product->title}'");

            return redirect()->route('products.index')->with('toast', ToastHelper::success('Product updated successfully.'));
        } catch (\Exception $e) {
            return redirect()->back()->withInput()->with('toast', ToastHelper::error('Failed to update product: ' . $e->getMessage()));
        }
    }

    /**
     * Remove the specified product.
     */
    public function destroy(Product $product)
    {
        try {
            $productData = $product->toArray();
            $product->delete();

            activity('products')
                ->performedOn($product)
                ->causedBy(request()->user())
                ->event('deleted')
                ->withProperties([
                    'deleted_data' => $productData,
                    'ip' => request()->ip(),
                    'user_agent' => request()->userAgent(),
                ])
                ->log("Deleted product '{$product->title}'");

            return redirect()->back()->with('toast', ToastHelper::success('Product deleted successfully.'));
        } catch (\Exception $e) {
            return redirect()->back()->with('toast', ToastHelper::error('Failed to delete product: ' . $e->getMessage()));
        }
    }

    /**
     * Get categories (for dropdown in modal) – used as an API endpoint.
     */
    public function categories()
    {
        try {
            return response()->json(
                ProductCategory::where('is_active', true)
                    ->orderBy('name')
                    ->get(['id', 'name', 'slug', 'description'])
            );
        } catch (\Exception $e) {
            \Log::error("Failed to fetch categories: " . $e->getMessage());
            return response()->json(['error' => 'Internal Server Error'], 500);
        }
    }

    public function storeCategory(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:product_categories,slug',
        ]);

        $category = ProductCategory::create([
            'name' => $request->name,
            'slug' => $request->slug,
            'is_active' => true,
        ]);

        return response()->json($category);
    }

    public function updateCategory(Request $request, $id)
    {
        $request->merge(['id' => $id]);
        $request->validate([
            'id' => 'required|exists:product_categories,id',
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:product_categories,slug,' . $id,
        ]);

        $category = ProductCategory::findOrFail($id);
        $category->update([
            'name' => $request->name,
            'slug' => $request->slug,
            'is_active' => true,
        ]);

        return response()->json($category);
    }

    public function deleteCategory(Request $request, $id)
    {
        $request->merge(['id' => $id]);
        $request->validate([
            'id' => 'required|exists:product_categories,id',
        ]);

        $category = ProductCategory::findOrFail($id);
        $category->delete();

        return response()->json(['success' => true]);
    }
}
