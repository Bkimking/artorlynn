<?php

namespace App\Helpers;

class ToastHelper
{
    public static function success(string $message, string $title = 'Success'): array
    {
        return [
            'type' => 'success',
            'title' => $title,
            'message' => $message,
            'duration' => 5000,
        ];
    }

    public static function error(string $message, string $title = 'Error'): array
    {
        return [
            'type' => 'error',
            'title' => $title,
            'message' => $message,
            'duration' => 5000,
        ];
    }

    public static function warning(string $message, string $title = 'Warning'): array
    {
        return [
            'type' => 'warning',
            'title' => $title,
            'message' => $message,
            'duration' => 5000,
        ];
    }

    public static function info(string $message, string $title = 'Info'): array
    {
        return [
            'type' => 'info',
            'title' => $title,
            'message' => $message,
            'duration' => 5000,
        ];
    }
}