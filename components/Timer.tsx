import React, { useState, useEffect, useRef } from 'react';
import { StudySession } from '../types';
import { TimerIcon, PlayIcon, PauseIcon, StopIcon, SparklesIcon, MusicIcon } from './Icons';

interface TimerProps {
  onSessionComplete: (session: StudySession) => void;
  taskName: string;
  onTaskNameChange: (name: string) => void;
  onTaskComplete: (taskName: string) => void;
  onPickNewTask: (currentTask: string) => void;
}

const Timer: React.FC<TimerProps> = ({ onSessionComplete, taskName, onTaskNameChange, onTaskComplete, onPickNewTask }) => {
  const [time, setTime] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const timerRef = useRef<number | null>(null);
  const [dialog, setDialog] = useState<'hidden' | 'confirm_finish' | 'ask_switch'>('hidden');

  useEffect(() => {
    if (isRunning) {
      timerRef.current = window.setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    } else {
      if (timerRef.current) window.clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [isRunning]);

  const handleStartPause = () => {
    if (!taskName.trim()) {
      alert('Please enter a task name or have Tiggy pick one!');
      return;
    }
    setIsRunning(!isRunning);
  };

  const handleStop = () => {
    setIsRunning(false);
    if (time > 0) {
      setDialog('confirm_finish');
    }
  };
  
  const logSessionAndReset = () => {
     if (time > 0) {
      onSessionComplete({ taskName, duration: time, timestamp: new Date() });
    }
    setTime(0);
    setDialog('hidden');
  }

  const handleConfirmFinish = () => {
    onTaskComplete(taskName);
    logSessionAndReset();
  };

  const handleDenyFinish = () => {
    setDialog('ask_switch');
  }
  
  const handleSwitchTask = () => {
    onPickNewTask(taskName);
    logSessionAndReset();
  }
  
  const handleKeepTask = () => {
    logSessionAndReset();
  }

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const renderDialog = () => {
    if (dialog === 'hidden') return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-sm text-center">
          {dialog === 'confirm_finish' && (
            <>
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">Great work!</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">Did you finish the task: <br/><span className="font-semibold">"{taskName}"</span>?</p>
              <div className="flex justify-center gap-4">
                <button onClick={handleConfirmFinish} className="px-6 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600">Yes, I did!</button>
                <button onClick={handleDenyFinish} className="px-6 py-2 bg-yellow-500 text-white rounded-lg font-semibold hover:bg-yellow-600">Not quite</button>
              </div>
            </>
          )}
          {dialog === 'ask_switch' && (
            <>
              <div className="flex justify-center items-center gap-3 mb-3">
                 <MusicIcon className="w-6 h-6 text-blue-500" />
                 <h3 className="text-lg font-bold text-gray-800 dark:text-white">That's okay!</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">Progress is progress. Keep it up!<br/>Do you want to work on something else for a bit?</p>
              <div className="flex justify-center gap-4">
                <button onClick={handleSwitchTask} className="px-6 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600">Pick a new task</button>
                <button onClick={handleKeepTask} className="px-6 py-2 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600">Stick with this</button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg transition-shadow duration-300 hover:shadow-xl">
      {renderDialog()}
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
        <TimerIcon className="w-6 h-6 mr-3 text-blue-500" />
        Study Session Timer
      </h2>
      <div className="mb-4">
        <input
          type="text"
          value={taskName}
          onChange={(e) => onTaskNameChange(e.target.value)}
          placeholder="What are you studying?"
          disabled={isRunning}
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-300 disabled:opacity-50"
        />
      </div>
      <div className="text-center bg-gray-100 dark:bg-gray-700 p-4 rounded-lg mb-4">
        <p className="text-5xl font-mono font-bold text-gray-800 dark:text-white">{formatTime(time)}</p>
      </div>
      <div className="flex justify-center space-x-4">
        <button
          onClick={handleStartPause}
          className={`btn-theme-orange flex items-center gap-2`}
        >
          {isRunning ? <PauseIcon className="w-5 h-5" /> : <PlayIcon className="w-5 h-5" />}
          {isRunning ? 'Pause' : 'Start'}
        </button>
        <button
          onClick={handleStop}
          disabled={time === 0 && !isRunning}
          className="btn-theme-blue flex items-center gap-2"
        >
          <StopIcon className="w-5 h-5" />
          Stop
        </button>
      </div>
       {taskName && isRunning && (
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/50 rounded-lg text-center">
          <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
            Now studying: <span className="font-bold">{taskName}</span>
          </p>
        </div>
      )}
       {!isRunning && time > 0 && (
         <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/50 rounded-lg text-center">
            <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
              Timer is paused.
            </p>
        </div>
      )}
    </div>
  );
};

export default Timer;