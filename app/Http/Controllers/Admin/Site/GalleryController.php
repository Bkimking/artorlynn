<?php

namespace App\Http\Controllers\Admin\Site;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Site\GalleryRequest;
use App\Services\Admin\site\GalleryService;
use App\Helpers\ToastHelper;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GalleryController extends Controller
{
    protected $service;

    public function __construct(GalleryService $service)
    {
        $this->service = $service;
    }

    public function index()
    {
        $items = $this->service->getAll();
        return Inertia::render('admin/site/gallerys', [
            'items' => $items->resolve(),
        ]);
    }

    public function store(GalleryRequest $request)
    {
        try {
            $item = $this->service->create($request->except(['image', 'video']), $request->file('image'), $request->file('video'));

            activity('site_gallery')
                ->performedOn($item->resource)
                ->causedBy($request->user())
                ->event('created')
                ->withProperties(['attributes' => $item->resource->toArray()])
                ->log("Added gallery item '{$item->name}'");

            return redirect()->back()->with('toast', ToastHelper::success('Gallery added.'));
        } catch (\Exception $e) {
            return redirect()->back()->with('toast', ToastHelper::error('Failed: ' . $e->getMessage()));
        }
    }

    public function update($id, GalleryRequest $request)
    {
        try {
            $item = $this->service->update($id, $request->except(['image', 'video']), $request->file('image'), $request->file('video'));

            activity('site_gallery')
                ->performedOn($item->resource)
                ->causedBy($request->user())
                ->event('updated')
                ->withProperties(['attributes' => $item->resource->toArray()])
                ->log("Updated gallery item '{$item->name}'");

            return redirect()->back()->with('toast', ToastHelper::success('Gallery updated.'));
        } catch (\Exception $e) {
            return redirect()->back()->with('toast', ToastHelper::error('Failed: ' . $e->getMessage()));
        }
    }

    public function destroy($id, Request $request)
    {
        try {
            $item = $this->service->getById($id)->resource;
            $this->service->delete($id);

            activity('site_gallery')
                ->performedOn($item)
                ->causedBy($request->user())
                ->event('deleted')
                ->withProperties(['deleted_data' => $item->toArray()])
                ->log("Deleted gallery item '{$item->name}'");

            return redirect()->back()->with('toast', ToastHelper::success('Gallery deleted.'));
        } catch (\Exception $e) {
            return redirect()->back()->with('toast', ToastHelper::error('Failed: ' . $e->getMessage()));
        }
    }
}