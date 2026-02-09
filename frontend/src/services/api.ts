/**
 * API client for the Todo application with advanced features.
 *
 * This module provides a client for interacting with the backend API endpoints.
 */

import { Task, TaskFormData, FilterOptions, TaskQuery } from '../types/task';

// Base API URL - configurable based on environment
// For Vercel deployment, this will point to the same origin (relative paths)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api';

interface ApiErrorResponse {
  error: string;
  message: string;
  details?: Record<string, unknown>;
}

// Generic API call function
const apiCall = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;

  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      const errorResponse: ApiErrorResponse = await response.json().catch(() => ({
        error: 'Unknown Error',
        message: `HTTP Error ${response.status}`,
      }));

      throw new Error(errorResponse.message || `HTTP Error ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API call failed: ${url}`, error);
    throw error;
  }
};

// Task API functions
export const taskApi = {
  /**
   * Get all tasks with optional filtering, sorting, and pagination.
   */
  getTasks: async (filters?: FilterOptions, limit: number = 20, offset: number = 0): Promise<{ tasks: Task[]; total: number; offset: number; limit: number }> => {
    // For simplicity in this migration, we'll use the new todos endpoint
    // The filtering logic would need to be implemented in the new API route
    return apiCall('/todos');
  },

  /**
   * Create a new task with advanced features.
   */
  createTask: async (taskData: TaskFormData): Promise<Task> => {
    return apiCall<Task>('/todos', {
      method: 'POST',
      body: JSON.stringify({
        title: taskData.title,
        description: taskData.description,
        priority: taskData.priority
      }),
    });
  },

  /**
   * Get a specific task by ID.
   */
  getTaskById: async (taskId: string): Promise<Task> => {
    return apiCall<Task>(`/todos/${taskId}`);
  },

  /**
   * Update an existing task.
   */
  updateTask: async (taskId: string, taskData: Partial<TaskFormData>): Promise<Task> => {
    return apiCall<Task>(`/todos/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify({
        title: taskData.title,
        description: taskData.description,
        completed: taskData.completed,
        priority: taskData.priority
      }),
    });
  },

  /**
   * Delete a task by ID.
   */
  deleteTask: async (taskId: string): Promise<void> => {
    await apiCall(`/todos/${taskId}`, {
      method: 'DELETE',
    });
  },

  /**
   * Search tasks with query and filters.
   */
  searchTasks: async (query: string, filters?: FilterOptions, limit: number = 20): Promise<{ results: Task[]; total: number; query: string; took_ms: number }> => {
    // For now, return all tasks and implement search client-side
    // In a real implementation, you'd add search capability to the API route
    const allTasks = await taskApi.getTasks();
    const filteredTasks = allTasks.tasks.filter(task => 
      task.title.toLowerCase().includes(query.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(query.toLowerCase()))
    );
    
    return {
      results: filteredTasks,
      total: filteredTasks.length,
      query,
      took_ms: 0 // Placeholder
    };
  },

  /**
   * Toggle task completion status.
   */
  toggleTaskCompletion: async (taskId: string): Promise<Task> => {
    return apiCall<Task>(`/todos/${taskId}`, {
      method: 'PATCH',
    });
  },
};

// Recurring Task API functions
export const recurringTaskApi = {
  /**
   * Create a new recurring task pattern.
   */
  createRecurringPattern: async (patternData: { taskId: string; frequency: string; endDate?: string }): Promise<{ id: string; taskId: string; frequency: string; endDate?: string; createdAt: string }> => {
    // For now, we'll simulate this functionality
    // In a real implementation, you'd create a new API route for recurring tasks
    console.warn('Recurring tasks not fully implemented in this version');
    return {
      id: 'temp-id',
      taskId: patternData.taskId,
      frequency: patternData.frequency,
      endDate: patternData.endDate,
      createdAt: new Date().toISOString()
    };
  },

  /**
   * Get a recurring task pattern by ID.
   */
  getRecurringPattern: async (patternId: string): Promise<{ id: string; taskId: string; frequency: string; endDate?: string; createdAt: string }> => {
    // For now, we'll simulate this functionality
    console.warn('Recurring tasks not fully implemented in this version');
    return {
      id: patternId,
      taskId: 'temp-task-id',
      frequency: 'daily',
      endDate: undefined,
      createdAt: new Date().toISOString()
    };
  },

  /**
   * Update a recurring task pattern.
   */
  updateRecurringPattern: async (patternId: string, patternData: { frequency?: string; endDate?: string }): Promise<{ id: string; taskId: string; frequency: string; endDate?: string; createdAt: string }> => {
    // For now, we'll simulate this functionality
    console.warn('Recurring tasks not fully implemented in this version');
    return {
      id: patternId,
      taskId: 'temp-task-id',
      frequency: patternData.frequency || 'daily',
      endDate: patternData.endDate,
      createdAt: new Date().toISOString()
    };
  },

  /**
   * Delete a recurring task pattern.
   */
  deleteRecurringPattern: async (patternId: string): Promise<void> => {
    // For now, we'll simulate this functionality
    console.warn('Recurring tasks not fully implemented in this version');
  },
};

// Tag API functions
export const tagApi = {
  /**
   * Get all tags for the current user.
   */
  getUserTags: async (): Promise<Array<{ id: string; name: string; color: string; userId: string; createdAt: string; updatedAt: string }>> => {
    // For now, we'll return an empty array
    // In a real implementation, you'd create a tags API route
    return [];
  },

  /**
   * Create a new tag.
   */
  createTag: async (tagData: { name: string; color?: string }): Promise<{ id: string; name: string; color: string; userId: string; createdAt: string; updatedAt: string }> => {
    // For now, we'll simulate this functionality
    return {
      id: 'temp-id',
      name: tagData.name,
      color: tagData.color || '#3b82f6',
      userId: 'temp-user-id',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },
};

// General API utilities
export const apiUtils = {
  /**
   * Check if the API is reachable.
   */
  healthCheck: async (): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      return response.ok;
    } catch {
      return false;
    }
  },
};

const apiClient = {
  taskApi,
  recurringTaskApi,
  tagApi,
  apiUtils,
};

export default apiClient;