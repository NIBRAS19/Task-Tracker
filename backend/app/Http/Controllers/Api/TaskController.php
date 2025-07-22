<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Task;
use App\Jobs\SendTaskNotification;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;

class TaskController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        try {
            $query = $request->user()->tasks();

            // Apply filters
            if ($request->has('status') && in_array($request->status, ['todo', 'in-progress', 'done'])) {
                $query->byStatus($request->status);
            }

            if ($request->has('search') && !empty($request->search)) {
                $query->search($request->search);
            }

            $tasks = $query->orderBy('created_at', 'desc')->paginate(15);

            return response()->json([
                'success' => true,
                'message' => 'Tasks retrieved successfully',
                'data' => $tasks->items(),
                'pagination' => [
                    'current_page' => $tasks->currentPage(),
                    'last_page' => $tasks->lastPage(),
                    'per_page' => $tasks->perPage(),
                    'total' => $tasks->total(),
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve tasks',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'nullable|string',
                'status' => 'in:todo,in-progress,done',
            ]);

            $task = Task::create([
                'user_id' => $request->user()->id,
                'title' => $request->title,
                'description' => $request->description,
                'status' => $request->status ?? 'todo',
            ]);

            // Dispatch job for email notification
            SendTaskNotification::dispatch($task, $request->user());

            return response()->json([
                'success' => true,
                'message' => 'Task created successfully',
                'data' => $task
            ], 201);

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Task creation failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show(Request $request, Task $task): JsonResponse
    {
        try {
            // Check if task belongs to authenticated user
            if ($task->user_id !== $request->user()->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized access to task'
                ], 403);
            }

            return response()->json([
                'success' => true,
                'message' => 'Task retrieved successfully',
                'data' => $task
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve task',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, Task $task): JsonResponse
    {
        try {
            // Check if task belongs to authenticated user
            if ($task->user_id !== $request->user()->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized access to task'
                ], 403);
            }

            $request->validate([
                'title' => 'sometimes|required|string|max:255',
                'description' => 'nullable|string',
                'status' => 'sometimes|in:todo,in-progress,done',
            ]);

            $task->update($request->only(['title', 'description', 'status']));

            return response()->json([
                'success' => true,
                'message' => 'Task updated successfully',
                'data' => $task->fresh()
            ]);

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Task update failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy(Request $request, Task $task): JsonResponse
    {
        try {
            // Check if task belongs to authenticated user
            if ($task->user_id !== $request->user()->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized access to task'
                ], 403);
            }

            $task->delete();

            return response()->json([
                'success' => true,
                'message' => 'Task deleted successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Task deletion failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}