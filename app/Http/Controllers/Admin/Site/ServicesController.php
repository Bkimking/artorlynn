<?php

namespace App\Http\Controllers\Admin\Site;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Site\ServiceRequest;
use App\Models\Service;
use App\Services\Admin\Site\ServicesService;
use App\Helpers\ToastHelper;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ServicesController extends Controller
{
    protected $service;

    public function __construct(ServicesService $service)
    {
        $this->service = $service;
    }

    public function index()
    {
        $services = $this->service->getAll();
        return Inertia::render('admin/site/services', [
            'services' => $services->resolve(),
        ]);
    }

    public function store(ServiceRequest $request)
    {
        try {
            $service = $this->service->create($request->except('image'), $request->file('image'));

            activity('site_services')
                ->performedOn($service->resource)
                ->causedBy($request->user())
                ->event('created')
                ->withProperties(['attributes' => $service->resource->toArray()])
                ->log("Created service '{$service->title}'");

            return redirect()->back()->with('toast', ToastHelper::success('Service created.'));
        } catch (\Exception $e) {
            return redirect()->back()->with('toast', ToastHelper::error('Failed: ' . $e->getMessage()));
        }
    }

    public function update($id, ServiceRequest $request)
    {
        try {
            $service = $this->service->update($id, $request->except('image'), $request->file('image'));

            activity('site_services')
                ->performedOn($service->resource)
                ->causedBy($request->user())
                ->event('updated')
                ->withProperties(['attributes' => $service->resource->toArray()])
                ->log("Updated service '{$service->title}'");

            return redirect()->back()->with('toast', ToastHelper::success('Service updated.'));
        } catch (\Exception $e) {
            return redirect()->back()->with('toast', ToastHelper::error('Failed: ' . $e->getMessage()));
        }
    }

    public function destroy($id, Request $request)
    {
        try {
            $service = Service::findOrFail($id);
            $this->service->delete($id);

            activity('site_services')
                ->performedOn($service)
                ->causedBy($request->user())
                ->event('deleted')
                ->withProperties(['deleted_data' => $service->toArray()])
                ->log("Deleted service '{$service->title}'");

            return redirect()->back()->with('toast', ToastHelper::success('Service deleted.'));
        } catch (\Exception $e) {
            return redirect()->back()->with('toast', ToastHelper::error('Failed: ' . $e->getMessage()));
        }
    }
}