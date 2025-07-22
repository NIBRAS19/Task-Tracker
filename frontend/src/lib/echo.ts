import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { config } from './config';

declare global {
  interface Window {
    Pusher: typeof Pusher;
    Echo: any;
  }
}

// Make Pusher available globally
window.Pusher = Pusher;

const echo = new Echo({
  broadcaster: 'pusher',
  key: config.PUSHER_APP_KEY,
  cluster: config.PUSHER_APP_CLUSTER,
  forceTLS: true,
  authorizer: (channel: any) => {
    return {
      authorize: (socketId: string, callback: Function) => {
        const token = localStorage.getItem('token');
        
        if (!token) {
          callback('No auth token found', null);
          return;
        }

        fetch(config.BROADCASTING_AUTH_URL, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            socket_id: socketId,
            channel_name: channel.name,
          }),
        })
        .then(response => response.json())
        .then(data => callback(null, data))
        .catch(error => callback(error, null));
      }
    };
  },
});

window.Echo = echo;

export default echo;