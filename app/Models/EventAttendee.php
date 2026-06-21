<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;
use SimpleSoftwareIO\QrCode\Facades\QrCode;
use Illuminate\Support\Facades\Storage;
use App\Observers\EventAttendeeObserver;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use tbQuar\Facades\Quar;

#[ObservedBy(EventAttendeeObserver::class)]
class EventAttendee extends Model
{
    protected $fillable = [
        'event_id',
        'ticket_id',
        'name',
        'email',
        'phone',
        'amount_paid',
        'qr_code_path',
        'checked_in',
        'checked_in_at',
        'status',
        'notes',
    ];

    protected $casts = [
        'checked_in' => 'boolean',
        'checked_in_at' => 'datetime',
        'amount_paid' => 'decimal:2',
    ];

    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class);
    }

    protected static function booted()
    {
        static::creating(function ($attendee) {
            // Generate Ticket ID: AOL-2026-{6 random uppercase alphanum}
            if (!$attendee->ticket_id) {
                $attendee->ticket_id = static::generateUniqueTicketId();
            }
            
            // Generate QR Code
            $attendee->qr_code_path = $attendee->generateQrCode();
        });
    }

    public static function generateUniqueTicketId(): string
    {
        $year = date('Y');
        do {
            $id = "AOL-{$year}-" . strtoupper(Str::random(6));
        } while (static::where('ticket_id', $id)->exists());

        return $id;
    }

    public function generateQrCode(): string
    {
        $directory = 'qrcodes';
        if (!Storage::disk('public')->exists($directory)) {
            Storage::disk('public')->makeDirectory($directory);
        }

        $path = "{$directory}/{$this->ticket_id}.svg";
        
        // The QR code encodes only the ticket_id using tuncaybahadir/quar
        $qrCode = Quar::format('svg')
            ->size(300)
            ->margin(1)
            ->generate($this->ticket_id);

        Storage::disk('public')->put($path, (string) $qrCode);

        return $path;
    }
}
