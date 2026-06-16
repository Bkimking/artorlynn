<?php

namespace App\Http\Controllers\Admin\Site;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Site\ContactRequest;
use App\Services\Admin\Site\ContactService;
use App\Helpers\ToastHelper;
use Inertia\Inertia;

class ContactController extends Controller
{
    protected $service;

    public function __construct(ContactService $service)
    {
        $this->service = $service;
    }

    public function index()
    {
        $contact = $this->service->get();
        return Inertia::render('admin/site/contacts', [
            'contact' => $contact->resolve(),
        ]);
    }

    public function update(ContactRequest $request)
    {
        try {
            $contact = $this->service->update($request->validated());

            activity('site_contacts')
                ->performedOn($contact->resource)
                ->causedBy($request->user())
                ->event('updated')
                ->withProperties(['attributes' => $contact->resource->toArray()])
                ->log("Updated contact information");

            return redirect()->back()->with('toast', ToastHelper::success('Contacts saved.'));
        } catch (\Exception $e) {
            return redirect()->back()->with('toast', ToastHelper::error('Failed: ' . $e->getMessage()));
        }
    }
}