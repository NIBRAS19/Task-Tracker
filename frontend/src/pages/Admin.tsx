import { useState, useEffect } from 'react';
import { Task, adminApi } from '@/lib/api';
import { TaskCard } from '@/components/TaskCard';
import { Navbar } from '@/components/Navbar';
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
import { Search, Filter, Users, Shield, Activity } from 'lucide-react';

export default function Admin() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  const { toast } = useToast();

  // Task statistics
  const taskStats = {
    total: tasks.length,
    users: new Set(tasks.map(t => t.user_id)).size,
    todo: tasks.filter(t => t.status === 'todo').length,
    'in-progress': tasks.filter(t => t.status === 'in-progress').length,
    done: tasks.filter(t => t.status === 'done').length,
  };

  // Filter tasks based on search and status
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = !searchTerm || 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.user?.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const fetchAllTasks = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getAllTasks();
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

  // Admin cannot edit/delete tasks, only view
  const handleEdit = () => {
    toast({
      title: "Action Restricted",
      description: "As an admin, you can only view tasks but not edit them.",
      variant: "destructive",
    });
  };

  const handleDelete = () => {
    toast({
      title: "Action Restricted",
      description: "As an admin, you can only view tasks but not delete them.",
      variant: "destructive",
    });
  };

  const handleStatusChange = () => {
    toast({
      title: "Action Restricted",
      description: "As an admin, you can only view tasks but not modify them.",
      variant: "destructive",
    });
  };

  useEffect(() => {
    fetchAllTasks();
  }, []);

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
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          </div>
          <p className="text-muted-foreground">
            Overview of all tasks across the platform.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-card rounded-lg p-4 shadow-soft">
            <div className="flex items-center gap-2 mb-1">
              <Activity className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Total Tasks</span>
            </div>
            <span className="text-2xl font-bold">{taskStats.total}</span>
          </div>
          
          <div className="bg-card rounded-lg p-4 shadow-soft">
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Active Users</span>
            </div>
            <span className="text-2xl font-bold">{taskStats.users}</span>
          </div>
          
          <div className="bg-card rounded-lg p-4 shadow-soft">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-4 h-4 rounded-full bg-status-todo"></div>
              <span className="text-sm text-muted-foreground">To Do</span>
            </div>
            <span className="text-2xl font-bold">{taskStats.todo}</span>
          </div>
          
          <div className="bg-card rounded-lg p-4 shadow-soft">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-4 h-4 rounded-full bg-status-in-progress"></div>
              <span className="text-sm text-muted-foreground">In Progress</span>
            </div>
            <span className="text-2xl font-bold">{taskStats['in-progress']}</span>
          </div>
          
          <div className="bg-card rounded-lg p-4 shadow-soft">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-4 h-4 rounded-full bg-status-done"></div>
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
              placeholder="Search tasks, users, or emails..."
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
        </div>

        {/* Results Info */}
        {searchTerm && (
          <div className="mb-4">
            <Badge variant="secondary">
              {filteredTasks.length} result{filteredTasks.length !== 1 ? 's' : ''} 
              {searchTerm && ` for "${searchTerm}"`}
            </Badge>
          </div>
        )}

        {/* Task Grid */}
        {filteredTasks.length === 0 ? (
          <div className="text-center py-12">
            <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">
              {tasks.length === 0 ? 'No tasks in system' : 'No tasks found'}
            </h3>
            <p className="text-muted-foreground">
              {tasks.length === 0 
                ? 'No users have created tasks yet.' 
                : 'Try adjusting your search or filter criteria.'
              }
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onStatusChange={handleStatusChange}
                isAdmin={true}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}