<?php

namespace App\Http\Controllers\Admin\Site;

use App\Helpers\ToastHelper;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Site\HeroRequest;
use App\Services\Admin\site\HeroService;
use Inertia\Inertia;

class HeroController extends Controller
{
    protected $service;

    public function __construct(HeroService $service)
    {
        $this->service = $service;
    }

    public function index()
    {
        $hero = $this->service->get();

        return Inertia::render('admin/site/hero', [
            'hero' => $hero->resolve(),
        ]);
    }

    public function update(HeroRequest $request)
{
    try {
        $imageFiles = $request->file('images');
        $data = $request->except(['images', '_method']);

        $hero = $this->service->update($data, $imageFiles);

        activity('site_hero')
            ->performedOn($hero->resource)
            ->causedBy($request->user())
            ->event('updated')
            ->withProperties(['attributes' => $hero->resource->toArray()])
            ->log("Updated hero section");

        return redirect()->back()->with('toast', ToastHelper::success('Hero saved.'));
    } catch (\Exception $e) {
        return redirect()->back()->with('toast', ToastHelper::error('Failed: ' . $e->getMessage()));
    }
}

}
