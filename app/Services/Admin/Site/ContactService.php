<?php

namespace App\Services\Admin\Site;

use App\Models\Contact;
use App\Http\Resources\ContactResource;
use Illuminate\Support\Facades\DB;

class ContactService
{
    public function get()
    {
        // Only one record expected; create default if none exists
        $contact = Contact::first();
        if (!$contact) {
            $contact = Contact::create([
                'email_1' => '',
                'phone_1' => '',
                // other fields default null
            ]);
        }
        return new ContactResource($contact);
    }

    public function update(array $data)
    {
        return DB::transaction(function () use ($data) {
            $contact = Contact::first();
            if (!$contact) {
                $contact = Contact::create($data);
            } else {
                $contact->update($data);
            }
            return new ContactResource($contact);
        });
    }
}