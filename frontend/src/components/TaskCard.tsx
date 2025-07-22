import { useState } from 'react';
import { Task } from '@/lib/api';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Edit, Trash2, Clock, CheckCircle, Circle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: number) => void;
  onStatusChange: (taskId: number, status: Task['status']) => void;
  isAdmin?: boolean;
}

const statusConfig = {
  'todo': {
    icon: Circle,
    label: 'To Do',
    className: 'bg-status-todo text-status-todo-foreground',
  },
  'in-progress': {
    icon: Clock,
    label: 'In Progress',
    className: 'bg-status-in-progress text-status-in-progress-foreground',
  },
  'done': {
    icon: CheckCircle,
    label: 'Done',
    className: 'bg-status-done text-status-done-foreground',
  },
};

export const TaskCard: React.FC<TaskCardProps> = ({ 
  task, 
  onEdit, 
  onDelete, 
  onStatusChange,
  isAdmin = false 
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const config = statusConfig[task.status];
  const StatusIcon = config.icon;

  const handleDelete = async () => {
    if (isDeleting) return;
    setIsDeleting(true);
    try {
      await onDelete(task.id);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleStatusChange = (newStatus: Task['status']) => {
    if (newStatus !== task.status) {
      onStatusChange(task.id, newStatus);
    }
  };

  return (
    <Card className="group hover:shadow-medium transition-all duration-300 hover:-translate-y-1">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg truncate">{task.title}</h3>
            {isAdmin && task.user && (
              <p className="text-sm text-muted-foreground mt-1">
                by {task.user.name}
              </p>
            )}
          </div>
          
          <div className="flex items-center gap-2 ml-4">
            <Badge className={cn("gap-1", config.className)}>
              <StatusIcon className="w-3 h-3" />
              {config.label}
            </Badge>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(task)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                
                {/* Status change options */}
                {Object.entries(statusConfig).map(([status, statusConf]) => {
                  if (status === task.status) return null;
                  const StatusIcon = statusConf.icon;
                  return (
                    <DropdownMenuItem 
                      key={status}
                      onClick={() => handleStatusChange(status as Task['status'])}
                    >
                      <StatusIcon className="w-4 h-4 mr-2" />
                      Mark as {statusConf.label}
                    </DropdownMenuItem>
                  );
                })}
                
                <DropdownMenuItem 
                  onClick={handleDelete}
                  className="text-destructive"
                  disabled={isDeleting}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      
      {task.description && (
        <CardContent className="pt-0">
          <p className="text-muted-foreground text-sm leading-relaxed">
            {task.description}
          </p>
        </CardContent>
      )}
      
      <CardContent className="pt-0">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            Created {formatDistanceToNow(new Date(task.created_at), { addSuffix: true })}
          </span>
          {task.updated_at !== task.created_at && (
            <span>
              Updated {formatDistanceToNow(new Date(task.updated_at), { addSuffix: true })}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};