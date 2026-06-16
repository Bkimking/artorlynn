<?php

namespace App\Http\Controllers\Admin\Site;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Site\BannerRequest;
use App\Services\Admin\site\BannerService;
use App\Helpers\ToastHelper;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BannerController extends Controller
{
    protected $service;

    public function __construct(BannerService $service)
    {
        $this->service = $service;
    }

    public function index()
    {
        $banners = $this->service->getAll();
        return Inertia::render('admin/site/banners', [
            'banners' => $banners->resolve(),
        ]);
    }

    public function store(BannerRequest $request)
    {
        try {
            $banner = $this->service->create($request->validated());

            activity('site_banners')
                ->performedOn($banner->resource)
                ->causedBy($request->user())
                ->event('created')
                ->withProperties(['attributes' => $banner->resource->toArray()])
                ->log("Created banner '{$banner->text}'");

            return redirect()->back()->with('toast', ToastHelper::success('Banner created.'));
        } catch (\Exception $e) {
            return redirect()->back()->with('toast', ToastHelper::error('Failed: ' . $e->getMessage()));
        }
    }

    public function update($id, BannerRequest $request)
    {
        try {
            $banner = $this->service->update($id, $request->validated());

            activity('site_banners')
                ->performedOn($banner->resource)
                ->causedBy($request->user())
                ->event('updated')
                ->withProperties(['attributes' => $banner->resource->toArray()])
                ->log("Updated banner '{$banner->text}'");

            return redirect()->back()->with('toast', ToastHelper::success('Banner updated.'));
        } catch (\Exception $e) {
            return redirect()->back()->with('toast', ToastHelper::error('Failed: ' . $e->getMessage()));
        }
    }

    public function destroy($id, Request $request)
    {
        try {
            $banner = $this->service->getById($id)->resource;
            $this->service->delete($id);

            activity('site_banners')
                ->performedOn($banner)
                ->causedBy($request->user())
                ->event('deleted')
                ->withProperties(['deleted_data' => $banner->toArray()])
                ->log("Deleted banner '{$banner->text}'");

            return redirect()->back()->with('toast', ToastHelper::success('Banner deleted.'));
        } catch (\Exception $e) {
            return redirect()->back()->with('toast', ToastHelper::error('Failed: ' . $e->getMessage()));
        }
    }
}
