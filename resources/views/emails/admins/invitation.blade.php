<x-mail::message>
# Welcome to the Art of Lynn Admin Team

Hi {{ $name }},

An administrator account has been created for you. You can now log in to the dashboard to manage events, products, and site content.

**Your Credentials:**
- **Email:** {{ $email }}
- **Password:** `{{ $password }}`

<x-mail::button :url="$url">
Log In to Dashboard
</x-mail::button>

*Please change your password after your first login for security.*

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
