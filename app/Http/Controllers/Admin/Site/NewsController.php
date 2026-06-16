<?php

namespace App\Http\Controllers\Admin\Site;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Site\NewsRequest;
use App\Models\News;
use App\Services\Admin\site\NewsService;
use App\Helpers\ToastHelper;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NewsController extends Controller
{
    protected $service;

    public function __construct(NewsService $service)
    {
        $this->service = $service;
    }

    public function index()
    {
        $posts = $this->service->getAll();
        return Inertia::render('admin/site/news', [
            'posts' => $posts->resolve(),
        ]);
    }

    public function store(NewsRequest $request)
    {
        try {
            $post = $this->service->create($request->except('image'), $request->file('image'));

            activity('site_news')
                ->performedOn($post->resource)
                ->causedBy($request->user())
                ->event('created')
                ->withProperties(['attributes' => $post->resource->toArray()])
                ->log("Created news '{$post->title}'");

            return redirect()->back()->with('toast', ToastHelper::success('News post created.'));
        } catch (\Exception $e) {
            return redirect()->back()->with('toast', ToastHelper::error('Failed: ' . $e->getMessage()));
        }
    }

    public function update($id, NewsRequest $request)
    {
        try {
            $post = $this->service->update($id, $request->except('image'), $request->file('image'));

            activity('site_news')
                ->performedOn($post->resource)
                ->causedBy($request->user())
                ->event('updated')
                ->withProperties(['attributes' => $post->resource->toArray()])
                ->log("Updated news '{$post->title}'");

            return redirect()->back()->with('toast', ToastHelper::success('News post updated.'));
        } catch (\Exception $e) {
            return redirect()->back()->with('toast', ToastHelper::error('Failed: ' . $e->getMessage()));
        }
    }

    public function destroy($id, Request $request)
    {
        try {
            $post = News::findOrFail($id);
            $this->service->delete($id);

            activity('site_news')
                ->performedOn($post)
                ->causedBy($request->user())
                ->event('deleted')
                ->withProperties(['deleted_data' => $post->toArray()])
                ->log("Deleted news '{$post->title}'");

            return redirect()->back()->with('toast', ToastHelper::success('News post deleted.'));
        } catch (\Exception $e) {
            return redirect()->back()->with('toast', ToastHelper::error('Failed: ' . $e->getMessage()));
        }
    }
}