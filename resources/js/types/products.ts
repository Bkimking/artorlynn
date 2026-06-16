export interface Product {
    id: number;
    product_category_id: number;
    title: string;
    slug: string;
    description: string;
    price: string | number;
    compare_at_price: string | number | null;
    stock_quantity: number;
    images: string[] | null;
    status: 'draft' | 'published' | 'out_of_stock';
    is_featured: boolean;
    product_category?: ProductCategory;
    created_at: string;
    updated_at: string;
}

export interface ProductCategory {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    cover_image: string | null;
    is_active: boolean;
    products?: Product[];
    created_at: string;
    updated_at: string;
}
