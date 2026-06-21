<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Mail\AdminInvitation;
use App\Helpers\ToastHelper;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Inertia\Inertia;

class AdminController extends Controller
{
    public function index()
    {
        $admins = User::where('email', '!=', 'brian01kimathi@gmail.com')
            ->orderBy('created_at', 'desc')
            ->get();
        
        return Inertia::render('admin/admins', [
            'admins' => $admins,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'  => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
        ]);

        // Generate complex password
        // 10 chars: 1 upper, 1 lower, 1 digit, 1 special, then 6 random
        $password = $this->generateComplexPassword(10);

        $user = User::create([
            'name'     => $validated['name'],
            'email'    => $validated['email'],
            'password' => Hash::make($password),
            'email_verified_at' => now(), // Auto-verify for admins invited
        ]);

        activity('user_management')
            ->performedOn($user)
            ->causedBy($request->user())
            ->event('created')
            ->withProperties([
                'attributes' => ['name' => $user->name, 'email' => $user->email],
                'ip'         => $request->ip(),
                'user_agent' => $request->userAgent(),
            ])
            ->log("Created new admin account: {$user->email}");

        // Send invitation email
        Mail::to($user->email)->queue(new AdminInvitation($user, $password));

        return redirect()->back()->with('toast', ToastHelper::success('Admin account created and invitation sent.'));
    }

    public function update(User $admin, Request $request)
    {
        $validated = $request->validate([
            'name'  => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $admin->id,
        ]);

        $oldEmail = $admin->email;
        $admin->update($validated);

        activity('user_management')
            ->performedOn($admin)
            ->causedBy($request->user())
            ->event('updated')
            ->withProperties([
                'old'        => ['email' => $oldEmail],
                'attributes' => $admin->getAttributes(),
                'ip'         => $request->ip(),
                'user_agent' => $request->userAgent(),
            ])
            ->log("Updated admin: {$admin->email}");

        return redirect()->back()->with('toast', ToastHelper::success('Admin profile updated.'));
    }

    public function destroy(User $admin, Request $request)
    {
        if ($admin->id === $request->user()->id) {
            return redirect()->back()->with('toast', ToastHelper::error('You cannot delete your own account.'));
        }

        $email = $admin->email;
        $admin->delete();

        activity('user_management')
            ->performedOn($admin)
            ->causedBy($request->user())
            ->event('deleted')
            ->withProperties([
                'deleted_data' => ['name' => $admin->name, 'email' => $email],
                'ip'           => request()->ip(),
                'user_agent'   => request()->userAgent(),
            ])
            ->log("Deleted admin account: {$email}");

        return redirect()->back()->with('toast', ToastHelper::success('Admin account removed.'));
    }

    private function generateComplexPassword($length = 10)
    {
        $uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $lowercase = 'abcdefghijklmnopqrstuvwxyz';
        $digits    = '0123456789';
        $special   = '!@#$%^&*()-_=+';

        $password = '';
        $password .= $uppercase[rand(0, strlen($uppercase) - 1)];
        $password .= $lowercase[rand(0, strlen($lowercase) - 1)];
        $password .= $digits[rand(0, strlen($digits) - 1)];
        $password .= $special[rand(0, strlen($special) - 1)];

        $all = $uppercase . $lowercase . $digits . $special;
        for ($i = 0; $i < $length - 4; $i++) {
            $password .= $all[rand(0, strlen($all) - 1)];
        }

        return str_shuffle($password);
    }
}
