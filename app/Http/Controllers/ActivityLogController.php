<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Spatie\Activitylog\Models\Activity;

class ActivityLogController extends Controller
{
    /**
     * Display a listing of the activity logs with metrics and advanced filters.
     */
    public function index(Request $request): Response
    {
        $query = Activity::with(['causer', 'subject'])->orderBy('created_at', 'desc');

        // Search Filter (checks description, event type, causer name, subject type)
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('description', 'like', "%{$search}%")
                  ->orWhere('event', 'like', "%{$search}%")
                  ->orWhere('log_name', 'like', "%{$search}%")
                  ->orWhere('subject_type', 'like', "%{$search}%")
                  ->orWhereHasMorph('causer', [User::class], function ($morphQuery) use ($search) {
                      $morphQuery->where('name', 'like', "%{$search}%")
                                ->orWhere('email', 'like', "%{$search}%");
                  });
            });
        }

        // Event Type Filter
        if ($request->filled('event_type') && is_array($request->input('event_type'))) {
            $query->whereIn('event', $request->input('event_type'));
        }

        // User / Causer Filter
        if ($request->filled('causer_id')) {
            $query->where('causer_id', $request->input('causer_id'))
                  ->where('causer_type', User::class);
        }

        // Log Name Filter
        if ($request->filled('log_name')) {
            $logNames = (array) $request->input('log_name');
            $query->whereIn('log_name', $logNames);
        }

        // Subject Type Filter
        if ($request->filled('subject_type')) {
            $query->where('subject_type', $request->input('subject_type'));
        }

        // Date Range Filter
        if ($request->filled('date_range')) {
            $range = $request->input('date_range');
            $today = Carbon::today();

            switch ($range) {
                case 'today':
                    $query->whereDate('created_at', $today);
                    break;
                case 'yesterday':
                    $query->whereDate('created_at', Carbon::yesterday());
                    break;
                case 'last_7_days':
                    $query->where('created_at', '>=', Carbon::now()->subDays(7));
                    break;
                case 'last_30_days':
                    $query->where('created_at', '>=', Carbon::now()->subDays(30));
                    break;
                case 'this_month':
                    $query->whereMonth('created_at', Carbon::now()->month)
                          ->whereYear('created_at', Carbon::now()->year);
                    break;
                case 'last_month':
                    $lastMonth = Carbon::now()->subMonth();
                    $query->whereMonth('created_at', $lastMonth->month)
                          ->whereYear('created_at', $lastMonth->year);
                    break;
                case 'custom':
                    if ($request->filled('start_date')) {
                        $query->whereDate('created_at', '>=', Carbon::parse($request->input('start_date')));
                    }
                    if ($request->filled('end_date')) {
                        $query->whereDate('created_at', '<=', Carbon::parse($request->input('end_date')));
                    }
                    break;
            }
        }

        // Paginate results and format for the UI
        $logs = $query->paginate(15)
            ->withQueryString()
            ->through(function ($log) {
                $properties = $log->properties;
                $old = $properties['old'] ?? null;
                $new = $properties['attributes'] ?? null;

                return [
                    'id' => $log->id,
                    'log_name' => $log->log_name ?? 'default',
                    'description' => $log->description,
                    'subject_type' => $log->subject_type ? class_basename($log->subject_type) : null,
                    'subject_full_type' => $log->subject_type,
                    'subject_id' => $log->subject_id,
                    'subject_name' => $log->subject ? ($log->subject->name ?? $log->subject->email ?? $log->subject_id) : 'N/A',
                    'event' => $log->event ?? 'custom',
                    'causer' => $log->causer ? [
                        'id' => $log->causer->id,
                        'name' => $log->causer->name ?? $log->causer->email,
                        'avatar' => method_exists($log->causer, 'getAvatarUrl') ? $log->causer->getAvatarUrl() : "https://ui-avatars.com/api/?name=" . urlencode($log->causer->name ?? 'User'),
                    ] : null,
                    'properties' => $properties,
                    'old_values' => $old,
                    'new_values' => $new,
                    'created_at' => $log->created_at->format('M d, Y H:i:s'),
                ];
            });

        // Fetch users for dropdown filtering
        $users = User::orderBy('name')->get(['id', 'name', 'email']);

        // Fetch unique log names for dropdown filtering
        $logNames = Activity::whereNotNull('log_name')
            ->distinct()
            ->pluck('log_name')
            ->filter()
            ->values()
            ->toArray();

        $logNames = array_values(array_unique(array_merge([
            'events',
            'products',
            'accounts',
            'security',
        ], $logNames)));

        // Fetch unique subject types for dropdown filtering
        $subjectTypes = Activity::whereNotNull('subject_type')
            ->distinct()
            ->pluck('subject_type')
            ->map(fn($type) => [
                'full' => $type,
                'short' => class_basename($type),
            ]);

        // Compute dynamic activity analytics metrics
        $metrics = $this->calculateMetrics();

        return Inertia::render('logs/index', [
            'logs' => $logs,
            'users' => $users,
            'logNames' => $logNames,
            'subjectTypes' => $subjectTypes,
            'metrics' => $metrics,
            'filters' => $request->only([
                'search', 'event_type', 'causer_id', 'subject_type', 'log_name', 'date_range', 'start_date', 'end_date'
            ]),
        ]);
    }

    /**
     * Calculate metrics for the analytics dashboard.
     */
    protected function calculateMetrics(): array
    {
        $totalLogs = Activity::count();
        
        $eventCounts = Activity::select('event', DB::raw('count(*) as total'))
            ->groupBy('event')
            ->pluck('total', 'event')
            ->toArray();
            
        $volumeOverTime = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::today()->subDays($i);
            $dateStr = $date->format('Y-m-d');
            $displayStr = $date->format('D, M d');
            $count = Activity::whereDate('created_at', $dateStr)->count();
            
            $volumeOverTime[] = [
                'date' => $dateStr,
                'display' => $displayStr,
                'count' => $count,
            ];
        }
        
        $topUsers = Activity::select('causer_id', 'causer_type', DB::raw('count(*) as total'))
            ->whereNotNull('causer_id')
            ->where('causer_type', User::class)
            ->groupBy('causer_id', 'causer_type')
            ->orderBy('total', 'desc')
            ->limit(5)
            ->get()
            ->map(function($item) {
                $user = User::find($item->causer_id);
                return [
                    'name' => $user ? $user->name : 'Unknown User',
                    'avatar' => "https://ui-avatars.com/api/?name=" . urlencode($user ? $user->name : 'System'),
                    'total' => $item->total,
                ];
            });
            
        $subjectDistribution = Activity::select('subject_type', DB::raw('count(*) as total'))
            ->whereNotNull('subject_type')
            ->groupBy('subject_type')
            ->orderBy('total', 'desc')
            ->limit(5)
            ->get()
            ->map(fn($item) => [
                'name' => class_basename($item->subject_type),
                'total' => $item->total,
            ]);
            
        return [
            'total' => $totalLogs,
            'event_counts' => $eventCounts,
            'volume_over_time' => $volumeOverTime,
            'top_users' => $topUsers,
            'subject_distribution' => $subjectDistribution,
        ];
    }
}