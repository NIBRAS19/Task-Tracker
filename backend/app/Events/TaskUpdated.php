<?php

namespace App\Events;

use App\Models\Task;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class TaskUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $task;

    public function __construct(Task $task)
    {
        $this->task = $task->load('user');
        
        Log::info('TaskUpdated event created', [
            'task_id' => $task->id,
            'user_id' => $task->user_id,
            'title' => $task->title
        ]);
    }

    public function broadcastOn(): array
    {
        $channelName = "user.{$this->task->user_id}";
        Log::info('Broadcasting on channel', ['channel' => "private-{$channelName}"]);
        
        return [
            new PrivateChannel($channelName)
        ];
    }

    public function broadcastAs(): string
    {
        return 'task.updated';
    }

    public function broadcastWith(): array
    {
        $data = [
            'task' => [
                'id' => $this->task->id,
                'title' => $this->task->title,
                'description' => $this->task->description,
                'status' => $this->task->status,
                'created_at' => $this->task->created_at,
                'updated_at' => $this->task->updated_at,
            ],
            'message' => 'Task updated in real-time!'
        ];
        
        Log::info('Broadcasting data', $data);
        return $data;
    }
}