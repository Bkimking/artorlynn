<?php

namespace App\Http\Controllers\Admin\Site;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Site\FounderRequest;
use App\Services\Admin\Site\FounderService;
use App\Helpers\ToastHelper;
use Inertia\Inertia;

class FounderController extends Controller
{
    protected $service;

    public function __construct(FounderService $service)
    {
        $this->service = $service;
    }

    public function index()
    {
        $founder = $this->service->get();
        return Inertia::render('admin/site/founder', [
            'founder' => $founder->resolve(),
        ]);
    }

    public function update(FounderRequest $request)
    {
        try {
            $avatarFile = $request->file('avatar');
            $data = $request->except('avatar');
            $founder = $this->service->update($data, $avatarFile);

            activity('site_founder')
                ->performedOn($founder->resource)
                ->causedBy($request->user())
                ->event('updated')
                ->withProperties(['attributes' => $founder->resource->toArray()])
                ->log("Updated founder profile");

            return redirect()->back()->with('toast', ToastHelper::success('Founder saved.'));
        } catch (\Exception $e) {
            return redirect()->back()->with('toast', ToastHelper::error('Failed: ' . $e->getMessage()));
        }
    }
}