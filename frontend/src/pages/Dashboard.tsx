import { useState, useEffect } from 'react';
import { Task, tasksApi } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { TaskCard } from '@/components/TaskCard';
import { TaskForm } from '@/components/TaskForm';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Plus, Search, Filter, CheckSquare, Clock, Circle } from 'lucide-react';
import echo from '@/lib/echo';

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  
  const { user } = useAuth();
  const { toast } = useToast();

  // Task statistics
  const taskStats = {
    total: tasks.length,
    todo: tasks.filter(t => t.status === 'todo').length,
    'in-progress': tasks.filter(t => t.status === 'in-progress').length,
    done: tasks.filter(t => t.status === 'done').length,
  };

  // Filter tasks based on search and status
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = !searchTerm || 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await tasksApi.getTasks();
      setTasks(response.data.data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch tasks. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (data: {
    title: string;
    description: string;
    status: Task['status'];
  }) => {
    try {
      const response = await tasksApi.createTask(data);
      setTasks(prev => [response.data.data, ...prev]);
      toast({
        title: "Task Created",
        description: "Your task has been created successfully.",
      });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to create task';
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleUpdateTask = async (data: {
    title: string;
    description: string;
    status: Task['status'];
  }) => {
    if (!editingTask) return;
    
    try {
      const response = await tasksApi.updateTask(editingTask.id, data);
      setTasks(prev => prev.map(task => 
        task.id === editingTask.id ? response.data.data : task
      ));
      toast({
        title: "Task Updated",
        description: "Your task has been updated successfully.",
      });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update task';
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    try {
      await tasksApi.deleteTask(taskId);
      setTasks(prev => prev.filter(task => task.id !== taskId));
      toast({
        title: "Task Deleted",
        description: "Task has been deleted successfully.",
      });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to delete task';
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    }
  };

  const handleStatusChange = async (taskId: number, newStatus: Task['status']) => {
    try {
      const response = await tasksApi.updateTask(taskId, { status: newStatus });
      setTasks(prev => prev.map(task => 
        task.id === taskId ? response.data.data : task
      ));
      toast({
        title: "Status Updated",
        description: `Task status changed to ${newStatus.replace('-', ' ')}.`,
      });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update task status';
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    }
  };

  const openCreateForm = () => {
    setEditingTask(undefined);
    setIsTaskFormOpen(true);
  };

  const openEditForm = (task: Task) => {
    setEditingTask(task);
    setIsTaskFormOpen(true);
  };

  const closeForm = () => {
    setIsTaskFormOpen(false);
    setEditingTask(undefined);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Real-time updates
  useEffect(() => {
    if (!user) return;

    const channel = echo.private(`user.${user.id}`);
    
    channel.listen('TaskUpdated', (event: any) => {
      console.log('Real-time task update received:', event);
      
      // Update the task in the local state
      setTasks(prev => prev.map(task => 
        task.id === event.task.id ? event.task : task
      ));
      
      toast({
        title: "Task Updated",
        description: event.message || "Task has been updated.",
      });
    });

    return () => {
      channel.stopListening('TaskUpdated');
      echo.leaveChannel(`user.${user.id}`);
    };
  }, [user, toast]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Tasks</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.name}! Here are your tasks.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card rounded-lg p-4 shadow-soft">
            <div className="flex items-center gap-2 mb-1">
              <CheckSquare className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Total</span>
            </div>
            <span className="text-2xl font-bold">{taskStats.total}</span>
          </div>
          
          <div className="bg-card rounded-lg p-4 shadow-soft">
            <div className="flex items-center gap-2 mb-1">
              <Circle className="w-4 h-4 text-status-todo-foreground" />
              <span className="text-sm text-muted-foreground">To Do</span>
            </div>
            <span className="text-2xl font-bold">{taskStats.todo}</span>
          </div>
          
          <div className="bg-card rounded-lg p-4 shadow-soft">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-4 h-4 text-status-in-progress-foreground" />
              <span className="text-sm text-muted-foreground">In Progress</span>
            </div>
            <span className="text-2xl font-bold">{taskStats['in-progress']}</span>
          </div>
          
          <div className="bg-card rounded-lg p-4 shadow-soft">
            <div className="flex items-center gap-2 mb-1">
              <CheckSquare className="w-4 h-4 text-status-done-foreground" />
              <span className="text-sm text-muted-foreground">Done</span>
            </div>
            <span className="text-2xl font-bold">{taskStats.done}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-48">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="todo">To Do</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="done">Done</SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={openCreateForm} className="gap-2">
            <Plus className="w-4 h-4" />
            New Task
          </Button>
        </div>

        {/* Task Grid */}
        {filteredTasks.length === 0 ? (
          <div className="text-center py-12">
            <CheckSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">
              {tasks.length === 0 ? 'No tasks yet' : 'No tasks found'}
            </h3>
            <p className="text-muted-foreground mb-4">
              {tasks.length === 0 
                ? 'Create your first task to get started.' 
                : 'Try adjusting your search or filter criteria.'
              }
            </p>
            {tasks.length === 0 && (
              <Button onClick={openCreateForm} className="gap-2">
                <Plus className="w-4 h-4" />
                Create Your First Task
              </Button>
            )}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={openEditForm}
                onDelete={handleDeleteTask}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )}

        {/* Task Form */}
        <TaskForm
          task={editingTask}
          isOpen={isTaskFormOpen}
          onClose={closeForm}
          onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
        />
      </div>
    </div>
  );
}