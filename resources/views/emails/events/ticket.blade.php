<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Your Event Ticket</title>
    <style>
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: #1a1a1a;
            margin: 0;
            padding: 0;
            background-color: #f9fafb;
        }
        .container {
            max-width: 600px;
            margin: 40px auto;
            background: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        .header {
            background-color: #000000;
            color: #ffffff;
            padding: 32px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 700;
            letter-spacing: -0.025em;
        }
        .content {
            padding: 32px;
        }
        .ticket-info {
            background-color: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 24px;
            margin-bottom: 32px;
        }
        .info-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 12px;
            border-bottom: 1px dashed #e2e8f0;
            padding-bottom: 8px;
        }
        .info-row:last-child {
            border-bottom: none;
            margin-bottom: 0;
            padding-bottom: 0;
        }
        .label {
            font-size: 14px;
            color: #64748b;
            font-weight: 500;
        }
        .value {
            font-size: 14px;
            color: #1e293b;
            font-weight: 600;
            text-align: right;
        }
        .qr-section {
            text-align: center;
            padding: 24px;
            background-color: #ffffff;
            border: 2px solid #f1f5f9;
            border-radius: 12px;
        }
        .qr-code {
            max-width: 200px;
            margin: 0 auto 16px;
        }
        .ticket-id {
            font-family: 'Monaco', 'Consolas', monospace;
            font-size: 18px;
            font-weight: 700;
            color: #000000;
            letter-spacing: 0.1em;
        }
        .footer {
            text-align: center;
            padding: 24px;
            font-size: 12px;
            color: #94a3b8;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Art of Lynn</h1>
        </div>
        <div class="content">
            <h2 style="margin-top: 0; font-size: 20px;">Hi {{ $attendee->name }},</h2>
            <p>Your ticket for <strong>{{ $attendee->event->title }}</strong> is confirmed! Please present the QR code below at the entrance.</p>

            <div class="ticket-info">
                <table style="width: 100%;">
                    <tr>
                        <td class="label">Event Date</td>
                        <td class="value">{{ $attendee->event->event_date->format('F d, Y @ h:i A') }}</td>
                    </tr>
                    <tr>
                        <td class="label">Location</td>
                        <td class="value">{{ $attendee->event->location_name }}</td>
                    </tr>
                    <tr>
                        <td class="label">Attendee</td>
                        <td class="value">{{ $attendee->name }}</td>
                    </tr>
                    <tr>
                        <td class="label">Amount Paid</td>
                        <td class="value">${{ number_format($attendee->amount_paid, 2) }}</td>
                    </tr>
                </table>
            </div>

            <div class="qr-section">
                <div class="qr-code">
                    <img src="{{ $message->embed(storage_path('app/public/' . $attendee->qr_code_path)) }}" alt="QR Code" style="width: 100%; height: auto;">
                </div>
                <div class="ticket-id">{{ $attendee->ticket_id }}</div>
                <p style="font-size: 12px; color: #64748b; margin-top: 8px;">Scan this code at the venue check-in.</p>
            </div>
        </div>
        <div class="footer">
            &copy; {{ date('Y') }} Art of Lynn. All rights reserved.<br>
            If you have any questions, please contact us.
        </div>
    </div>
</body>
</html>
