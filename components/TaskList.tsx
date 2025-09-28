import React, { useState } from 'react';
import { ClipboardListIcon, PlusIcon, XIcon, ZapIcon } from './Icons';

interface TaskListProps {
  tasks: string[];
  onTasksChange: (tasks: string[]) => void;
  onTaskSelect: (task: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onTasksChange, onTaskSelect }) => {
  const [newTask, setNewTask] = useState<string>('');
  const [isPicking, setIsPicking] = useState<boolean>(false);
  const [pickedTask, setPickedTask] = useState<string | null>(null);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.trim()) {
      onTasksChange([...tasks, newTask.trim()]);
      setNewTask('');
    }
  };

  const handleRemoveTask = (indexToRemove: number) => {
    onTasksChange(tasks.filter((_, index) => index !== indexToRemove));
  };

  const handlePickRandomTask = () => {
    if (tasks.length > 0 && !isPicking) {
      setIsPicking(true);
      setPickedTask(null);

      setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * tasks.length);
        const chosenTask = tasks[randomIndex];
        onTaskSelect(chosenTask);
        setPickedTask(chosenTask);
        setIsPicking(false);
      }, 1200); // Simulate Tiggy thinking
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg transition-shadow duration-300 hover:shadow-xl">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
        <ClipboardListIcon className="w-6 h-6 mr-3 text-blue-500" />
        Today's Task List
      </h2>
      
      <form onSubmit={handleAddTask} className="flex gap-2 mb-4">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new study task..."
          className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-300"
        />
        <button type="submit" className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 dark:disabled:bg-blue-800" disabled={!newTask.trim()}>
          <PlusIcon className="w-6 h-6" />
        </button>
      </form>

      <div className="space-y-2 mb-4 max-h-40 overflow-y-auto pr-2">
        {tasks.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">No tasks yet. Add one above!</p>
        ) : (
          tasks.map((task, index) => (
            <div key={index} className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 p-2 rounded-md">
              <span className="text-gray-800 dark:text-gray-200">{task}</span>
              <button onClick={() => handleRemoveTask(index)} className="text-gray-400 hover:text-red-500">
                <XIcon className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>

      <button
  onClick={handlePickRandomTask}
  disabled={tasks.length === 0 || isPicking}
  className="w-full btn-theme-orange flex items-center justify-center gap-2"
      >
        {isPicking ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            <span>Tiggy is picking...</span>
          </>
        ) : (
          <>
            <ZapIcon className="w-5 h-5" />
            Ask Tiggy to Pick!
          </>
        )}
      </button>

      {pickedTask && !isPicking && (
        <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/50 border border-green-200 dark:border-green-700 rounded-lg flex items-center justify-center space-x-2">
          <p className="text-sm font-medium text-green-800 dark:text-green-200">
            Tiggy picked: <span className="font-bold">{pickedTask}</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default TaskList;