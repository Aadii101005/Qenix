'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { LogOut, Plus, Trash2, CheckCircle, Circle } from 'lucide-react';

export default function DashboardPage() {
    const { user, logout, loading } = useAuth();
    const router = useRouter();
    const [tasks, setTasks] = useState<any[]>([]);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
        if (user) {
            fetchTasks();
        }
    }, [user, loading, router]);

    const fetchTasks = async () => {
        try {
            const response = await api.get('/tasks');
            setTasks(response.data);
        } catch (err) {
            console.error('Failed to fetch tasks');
        } finally {
            setIsLoading(false);
        }
    };

    const createTask = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTaskTitle.trim()) return;
        try {
            const response = await api.post('/tasks', { title: newTaskTitle });
            setTasks([...tasks, response.data]);
            setNewTaskTitle('');
        } catch (err) {
            console.error('Failed to create task');

        }
    };

    const toggleTaskStatus = async (task: any) => {
        const newStatus = task.status === 'Completed' ? 'Pending' : 'Completed';
        try {
            const response = await api.put(`/tasks/${task._id}`, { status: newStatus });
            setTasks(tasks.map((t) => (t._id === task._id ? response.data : t)));
        } catch (err) {
            console.error('Failed to update task');
        }
    };

    const deleteTask = async (id: string) => {
        try {
            let result = await api.delete(`/tasks/${id}`);
            console.log(result);
            setTasks(tasks.filter((t) => t._id !== id));
        } catch (err) {
            console.error(err, 'Failed to delete task');
        }
    };

    if (loading || isLoading) return <div className="flex h-screen items-center justify-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-100 pb-12">
            <nav className="bg-white shadow-sm">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between items-center">
                        <h1 className="text-xl font-bold text-gray-900">Task Manager</h1>
                        <div className="flex items-center space-x-4">
                            <span className="text-gray-700">Hello, {user?.name}</span>
                            <button
                                onClick={logout}
                                className="inline-flex items-center text-sm text-red-600 hover:text-red-500"
                            >
                                <LogOut className="mr-1 h-4 w-4" /> Sign out
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="mx-auto max-w-4xl mt-10 px-4">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <form onSubmit={createTask} className="flex space-x-2 mb-8">
                        <input
                            type="text"
                           
                            className="flex-1 text-black rounded-md border-red-300 border p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            placeholder="Add a new task..."
                            value={newTaskTitle}
                            onChange={(e) => setNewTaskTitle(e.target.value)}
                        />
                        <button
                            type="submit"
                            className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                        >
                            <Plus className="mr-1 h-5 w-5" /> Add Task
                        </button>
                    </form>

                    <div className="space-y-4">
                        {tasks.length === 0 ? (
                            <p className="text-center text-gray-500 py-10">No tasks yet. Create one above!</p>
                        ) : (
                            tasks.map((task) => (
                                <div
                                    key={task._id}
                                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-center space-x-3">
                                        <button onClick={() => toggleTaskStatus(task)}>
                                            {task.status === 'Completed' ? (
                                                <CheckCircle className="h-6 w-6 text-green-500" />
                                            ) : (
                                                <Circle className="h-6 w-6 text-gray-300" />
                                            )}
                                        </button>
                                        <span
                                            className={`text-lg ${task.status === 'Completed' ? 'line-through text-gray-400' : 'text-gray-900'
                                                }`}
                                        >
                                            {task.title}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => deleteTask(task._id)}
                                        className="text-red-400 hover:text-red-600 p-1"
                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
