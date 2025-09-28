import React, { useState } from 'react';
import { StudySession } from './types';
import FileUpload from './components/FileUpload';
import Chatbot from './components/Chatbot';
import Timer from './components/Timer';
import StudyHabits from './components/StudyHabits';
import TaskList from './components/TaskList';
import Confetti from './components/Confetti';
import './tiggy.css';

const App: React.FC = () => {
  const [documentText, setDocumentText] = useState<string | null>(null);
  const [studySessions, setStudySessions] = useState<StudySession[]>([]);
  const [chatbotKey, setChatbotKey] = useState<number>(0);
  const [timerTask, setTimerTask] = useState<string>('');
  const [tasks, setTasks] = useState<string[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);


  const handleDocumentLoad = (text: string) => {
    setDocumentText(text);
    setChatbotKey(prevKey => prevKey + 1); // Reset chatbot state when new doc is loaded
  };

  const handleSessionComplete = (session: StudySession) => {
    setStudySessions(prevSessions => [...prevSessions, session]);
    // Task name is cleared or changed by the timer's new logic
  };

  const pickRandomTask = (excludeTask?: string) => {
    const availableTasks = excludeTask ? tasks.filter(t => t !== excludeTask) : tasks;
    if (availableTasks.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableTasks.length);
      setTimerTask(availableTasks[randomIndex]);
    } else {
      setTimerTask(''); // No tasks left
    }
  };

  const handleTaskComplete = (completedTask: string) => {
    const updatedTasks = tasks.filter(t => t !== completedTask);
    setTasks(updatedTasks);

    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 5000); // Confetti for 5 seconds

    // Pick a new task if any are left
    const availableTasks = updatedTasks;
    if (availableTasks.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableTasks.length);
      setTimerTask(availableTasks[randomIndex]);
    } else {
      setTimerTask('');
    }
  };

  return (
    <div className="tiggy-app">
      {showConfetti && <Confetti />}
      <header className="tiggy-header">
        <div className="tiggy-header-content">
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img src="/assets/face.png" alt="Tiggy Icon" className="tiggy-icon" style={{ width: '2rem', height: '2rem', borderRadius: '50%' }} />
            <h1 className="tiggy-title">
              <a href="/index.html" style={{ color: 'inherit', textDecoration: 'none' }}>Tiggy AI</a>
            </h1>
          </div>
        </div>
      </header>

      <main className="tiggy-main">
        <div className="tiggy-sidebar">
          <FileUpload onDocumentLoad={handleDocumentLoad} />
          <TaskList 
            tasks={tasks}
            onTasksChange={setTasks}
            onTaskSelect={setTimerTask} 
          />
          <Timer 
            onSessionComplete={handleSessionComplete} 
            taskName={timerTask}
            onTaskNameChange={setTimerTask}
            onTaskComplete={handleTaskComplete}
            onPickNewTask={pickRandomTask}
          />
        </div>
        <div className="tiggy-content">
          <Chatbot documentText={documentText} key={chatbotKey} />
        </div>
      </main>
      <div className="tiggy-studyhabits">
        <StudyHabits studySessions={studySessions} />
      </div>
    </div>
  );
};

export default App;