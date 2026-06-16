<?php

namespace App\Http\Controllers\Admin\Site;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Site\FaqRequest;
use App\Services\Admin\Site\FaqsService;
use App\Helpers\ToastHelper;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FaqsController extends Controller
{
    protected $service;

    public function __construct(FaqsService $service)
    {
        $this->service = $service;
    }

    public function index()
    {
        $faqs = $this->service->getAll();
        return Inertia::render('admin/site/faqs', [
            'faqs' => $faqs->resolve(),
        ]);
    }

    public function store(FaqRequest $request)
    {
        try {
            $faq = $this->service->create($request->validated());

            activity('site_faqs')
                ->performedOn($faq->resource)
                ->causedBy($request->user())
                ->event('created')
                ->withProperties(['attributes' => $faq->resource->toArray()])
                ->log("Created FAQ '{$faq->question}'");

            return redirect()->back()->with('toast', ToastHelper::success('FAQ created.'));
        } catch (\Exception $e) {
            return redirect()->back()->with('toast', ToastHelper::error('Failed: ' . $e->getMessage()));
        }
    }

    public function update($id, FaqRequest $request)
    {
        try {
            $faq = $this->service->update($id, $request->validated());

            activity('site_faqs')
                ->performedOn($faq->resource)
                ->causedBy($request->user())
                ->event('updated')
                ->withProperties(['attributes' => $faq->resource->toArray()])
                ->log("Updated FAQ '{$faq->question}'");

            return redirect()->back()->with('toast', ToastHelper::success('FAQ updated.'));
        } catch (\Exception $e) {
            return redirect()->back()->with('toast', ToastHelper::error('Failed: ' . $e->getMessage()));
        }
    }

    public function destroy($id, Request $request)
    {
        try {
            $faq = $this->service->getById($id)->resource;
            $this->service->delete($id);

            activity('site_faqs')
                ->performedOn($faq)
                ->causedBy($request->user())
                ->event('deleted')
                ->withProperties(['deleted_data' => $faq->toArray()])
                ->log("Deleted FAQ '{$faq->question}'");

            return redirect()->back()->with('toast', ToastHelper::success('FAQ deleted.'));
        } catch (\Exception $e) {
            return redirect()->back()->with('toast', ToastHelper::error('Failed: ' . $e->getMessage()));
        }
    }

    public function reorder(Request $request)
    {
        try {
            $this->service->reorder($request->input('order', []));
            return response()->json(['success' => true]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}