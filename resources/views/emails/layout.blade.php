<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <style>
        body { font-family: Georgia, serif; background: #fafafa; margin: 0; padding: 0; }
        .wrap { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #eeeeee; box-shadow: 0 4px 12px rgba(0,0,0,0.03); }
        .header { background: #281b10; padding: 40px 32px; text-align: center; }
        .header h1 { color: #e8cbb5; margin: 0; font-size: 22px; font-weight: normal; letter-spacing: 0.2em; text-transform: uppercase; }
        .body { padding: 48px; color: #333333; line-height: 1.8; }
        .body h2 { font-size: 20px; color: #281b10; margin-top: 0; font-weight: normal; }
        .body p { margin-bottom: 1.5em; font-size: 15px; }
        .meta { background: #fdfaf7; border-radius: 8px; padding: 24px; margin: 32px 0; border-left: 2px solid #e8cbb5; }
        .meta-item { display: block; margin-bottom: 8px; font-size: 13px; }
        .meta-item strong { color: #281b10; width: 100px; display: inline-block; }
        .button-wrap { text-align: center; margin: 32px 0; }
        .button { background: #e8cbb5; color: #281b10; padding: 16px 32px; text-decoration: none; font-size: 13px; font-weight: bold; letter-spacing: 0.1em; border-radius: 4px; text-transform: uppercase; }
        .footer { padding: 32px; text-align: center; font-size: 11px; color: #999999; border-top: 1px solid #f0f0f0; }
    </style>
</head>
<body>
<div class="wrap">
    <div class="header">
        <h1>Art of Lynn</h1>
    </div>
    <div class="body">
        @yield('content')
    </div>
    <div class="footer">
        &copy; {{ date('Y') }} Art of Lynn · Color. Feel. Express.<br/>
        You are receiving this because of an action on our website.
    </div>
</div>
</body>
</html>
