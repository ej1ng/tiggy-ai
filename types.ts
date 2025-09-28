
export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface StudySession {
  taskName: string;
  duration: number; // in seconds
  timestamp: Date;
}
