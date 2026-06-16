<?php

namespace App\Http\Controllers\Admin\Site;

use App\Helpers\ToastHelper;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Site\PartnerRequest;
use App\Models\Partner;
use App\Services\Admin\Site\PartnerService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PartnerController extends Controller
{
    protected $service;

    public function __construct(PartnerService $service)
    {
        $this->service = $service;
    }

    public function index()
    {
        $partners = $this->service->getAll();

        return Inertia::render('admin/site/partners', [
            'partners' => $partners->resolve(),
        ]);
    }

    public function store(PartnerRequest $request)
    {
        try {
            $partner = $this->service->create($request->except('logo'), $request->file('logo'));

            activity('site_partners')
                ->performedOn($partner->resource)
                ->causedBy($request->user())
                ->event('created')
                ->withProperties(['attributes' => $partner->resource->toArray()])
                ->log("Created partner '{$partner->name}'");

            return redirect()->back()->with('toast', ToastHelper::success('Partner added.'));
        } catch (\Exception $e) {
            return redirect()->back()->with('toast', ToastHelper::error('Failed: '.$e->getMessage()));
        }
    }

    public function update($id, PartnerRequest $request)
    {
        try {
            $partner = $this->service->update($id, $request->except('logo'), $request->file('logo'));

            activity('site_partners')
                ->performedOn($partner->resource)
                ->causedBy($request->user())
                ->event('updated')
                ->withProperties(['attributes' => $partner->resource->toArray()])
                ->log("Updated partner '{$partner->name}'");

            return redirect()->back()->with('toast', ToastHelper::success('Partner updated.'));
        } catch (\Exception $e) {
            return redirect()->back()->with('toast', ToastHelper::error('Failed: '.$e->getMessage()));
        }
    }

    public function destroy($id, Request $request)
    {
        try {
            $partner = Partner::findOrFail($id);
            $name = $partner->name;
            $this->service->delete($id);

            activity('site_partners')
                ->performedOn($partner)
                ->causedBy($request->user())
                ->event('deleted')
                ->withProperties(['deleted_data' => $partner->toArray()])
                ->log("Deleted partner '{$name}'");

            return redirect()->back()->with('toast', ToastHelper::success('Partner deleted.'));
        } catch (\Exception $e) {
            return redirect()->back()->with('toast', ToastHelper::error('Failed: '.$e->getMessage()));
        }
    }
}
