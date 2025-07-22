<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('user.{userId}', function ($user, $userId) {
    $authorized = (int) $user->id === (int) $userId;
    
    \Log::info('Channel authorization', [
        'user_id' => $user->id,
        'requested_userId' => $userId,
        'authorized' => $authorized
    ]);
    
    return $authorized;
});