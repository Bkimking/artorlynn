<?php

namespace App\Services\Admin\Site;

use App\Models\Faqs;
use App\Http\Resources\FaqsResource;
use Illuminate\Support\Facades\DB;

class FaqsService
{
     public function getAll()
    {
        $faqs = Faqs::orderBy('sorted_order')->get();
        return FaqsResource::collection($faqs);
    }

    public function getById($id)
    {
        return new FaqsResource(Faqs::findOrFail($id));
    }

    public function create(array $data)
    {
        return DB::transaction(function () use ($data) {
            // Set sorted_order to max+1
            $maxOrder = Faqs::max('sorted_order') ?? 0;
            $data['sorted_order'] = $maxOrder + 1;
            $faq = Faqs::create($data);
            return new FaqsResource($faq);
        });
    }

    public function update($id, array $data)
    {
        return DB::transaction(function () use ($id, $data) {
            $faq = Faqs::findOrFail($id);
            $faq->update($data);
            return new FaqsResource($faq);
        });
    }

    public function delete($id)
    {
        return DB::transaction(function () use ($id) {
            $faq = Faqs::findOrFail($id);
            $faq->delete();
            // Reorder remaining items
            $remaining = Faqs::orderBy('sorted_order')->get();
            foreach ($remaining as $index => $item) {
                $item->sorted_order = $index + 1;
                $item->save();
            }
            return true;
        });
    }

    public function reorder(array $orderIds)
    {
        return DB::transaction(function () use ($orderIds) {
            foreach ($orderIds as $index => $id) {
                Faqs::where('id', $id)->update(['sorted_order' => $index + 1]);
            }
            return true;
        });
    }
}