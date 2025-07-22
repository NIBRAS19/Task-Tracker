<?php

// routes/web.php - Add this for testing

Route::get('/test-broadcast', function () {
    $task = \App\Models\Task::first();
    
    if (!$task) {
        return 'No tasks found. Create a task first!';
    }
    
    \Log::info('Manual broadcast test started', ['task_id' => $task->id]);
    
    // Fire the event manually
    event(new \App\Events\TaskUpdated($task));
    
    return "Broadcasting test completed for task ID: {$task->id}. Check logs and Pusher dashboard!";
});



// use Illuminate\Support\Facades\Route;

// Route::get('/', function () {
//     return view('welcome');
// });


// routes/web.php - TEMPORARY TEST ROUTE
// Route::get('/test-broadcast', function () {
//     $user = \App\Models\User::first();
//     $task = \App\Models\Task::first();
    
//     if ($task && $user) {
//         event(new \App\Events\TaskUpdated($task));
//         return 'Event broadcasted! Check logs.';
//     }
    
//     return 'No task or user found';
// });