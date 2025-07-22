<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\TaskController;
use App\Http\Controllers\Api\AdminController;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth routes
    Route::post('/logout', [AuthController::class, 'logout']);
    
    // Task routes
    Route::apiResource('tasks', TaskController::class);
    
    // Admin routes
    Route::middleware('admin')->group(function () {
        Route::get('/admin/tasks', [AdminController::class, 'tasks']);
    });
});



