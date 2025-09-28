import { GoogleGenAI } from "@google/genai";
import { StudySession } from '../types';

// FIX: Initialize GoogleGenAI directly with process.env.API_KEY as per guidelines.
// The API key's availability is a hard requirement and should not be checked in code.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const askAboutDocument = async (context: string, question: string): Promise<string> => {
  const prompt = `
    You are Tiggy, a friendly and encouraging AI Study Buddy. Your goal is to help the user understand their study material better.
    A user has uploaded a document and is asking a question about it.
    Answer their question in a clear, friendly, and conversational way. Keep your answers helpful and relatively concise, but feel free to add a touch of encouragement.
    Use the provided document as the main source for your answers.

    --- DOCUMENT CONTEXT ---
    ${context}
    --- END OF CONTEXT ---

    User's Question: "${question}"

    Your Friendly Answer:
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "Sorry, I encountered an error while processing your request.";
  }
};


export const analyzeStudyHabits = async (sessions: StudySession[]): Promise<string> => {
  const formattedSessions = sessions.map(s => 
    `- Studied "${s.taskName}" for ${Math.round(s.duration / 60)} minutes on ${s.timestamp.toLocaleDateString()}`
  ).join('\n');

  const prompt = `
    You are Tiggy, an expert study coach. Based on the following study session history, analyze the user's study habits.
    Provide a brief, encouraging analysis and conclude with a single, clear, and actionable recommendation for what to study next.
    Keep your entire response short and easy to read.

    --- STUDY HISTORY ---
    ${formattedSessions}
    --- END OF HISTORY ---

    Brief Analysis and Key Recommendation:
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API for habit analysis:", error);
    return "Sorry, I couldn't analyze the study habits at this time.";
  }
};