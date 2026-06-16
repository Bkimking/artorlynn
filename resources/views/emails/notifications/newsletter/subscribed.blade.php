@extends('emails.layout')

@section('content')
    <h2>Welcome to Art of Lynn</h2>
    <p>Hi {{ $data['name'] ?? 'there' }},</p>
    <p>You've successfully subscribed to the Art of Lynn newsletter. You'll be the first to know about new collections, upcoming events, and exclusive insights.</p>
    
    <p>Thank you for joining our community!</p>

    <p>Best,<br/>Lynn</p>
@endsection
