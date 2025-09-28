
import React, { useState } from 'react';
import { StudySession } from '../types';
import { analyzeStudyHabits } from '../services/geminiService';
import { BarChartIcon, LightbulbIcon } from './Icons';

interface StudyHabitsProps {
  studySessions: StudySession[];
}

const StudyHabits: React.FC<StudyHabitsProps> = ({ studySessions }) => {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleAnalyze = async () => {
    setIsLoading(true);
    setAnalysis(null);
    try {
      const result = await analyzeStudyHabits(studySessions);
      setAnalysis(result);
    } catch (error) {
      setAnalysis('Failed to get analysis. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const totalMinutes = studySessions.reduce((acc, s) => acc + s.duration, 0) / 60;

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg transition-shadow duration-300 hover:shadow-xl">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
        <BarChartIcon className="w-6 h-6 mr-3 text-blue-500" />
        Your Study Habits
      </h2>
      
      <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
        <p><span className="font-semibold">{studySessions.length}</span> sessions logged.</p>
        <p><span className="font-semibold">{totalMinutes.toFixed(1)}</span> total minutes studied.</p>
      </div>

      <button
        onClick={handleAnalyze}
        disabled={studySessions.length === 0 || isLoading}
        className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 dark:disabled:bg-blue-800 disabled:cursor-not-allowed transition-colors duration-300 flex items-center justify-center gap-2"
      >
        <LightbulbIcon className="w-5 h-5" />
        {isLoading ? 'Analyzing...' : 'Get Study Recommendations'}
      </button>

      {analysis && (
        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/50 border border-blue-200 dark:border-blue-700 rounded-lg">
            <h3 className="font-bold text-blue-800 dark:text-blue-200 mb-2">Tiggy says:</h3>
            <p className="text-sm text-blue-900 dark:text-blue-100 whitespace-pre-wrap">{analysis}</p>
        </div>
      )}
    </div>
  );
};

export default StudyHabits;