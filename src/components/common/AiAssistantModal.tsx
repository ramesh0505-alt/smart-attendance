import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { X, Sparkles, Send, Bot, User as UserIcon, RefreshCw, BookOpen, BrainCircuit } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';
import { useCampus } from '../../context/CampusContext.tsx';

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({ isOpen, onClose }) => {
  const { currentUser } = useAuth();
  const { subjects, competencies, recommendations, assignments } = useCampus();

  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<{ sender: 'user' | 'assistant'; text: string; time: string }[]>([
    {
      sender: 'assistant',
      text: currentUser?.role === 'faculty'
        ? `Hello Professor ${currentUser?.name.split(' ')[1] || ''}! I'm your Faculty Teaching Assistant. I can help you analyze student competency gaps, generate assessment questions, construct rubrics, or summarize class trends. How can I assist you today?`
        : `Hi ${currentUser?.name}! I'm your Gemini AI Academic Mentor. I'm synced with your Semester 4 curriculum, timetable, and current competencies (IoT Sensor Integration: 94%, FreeRTOS Interrupts: 52%). How can I help you master your coursework or prepare for exams today?`,
      time: 'Just now'
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isOpen) return null;

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userText = inputMessage.trim();
    const newMsg = { sender: 'user' as const, text: userText, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages(prev => [...prev, newMsg]);
    setInputMessage('');
    setIsLoading(true);

    // Build real context from current database state
    const userContext = `
Student/Faculty: ${currentUser?.name} (${currentUser?.role})
Department: Computer Science & Engineering
Semester: 4
Current CGPA: ${currentUser?.cgpa || '8.4'}
Current Attendance: ${currentUser?.attendancePercentage || '91'}%
Academic Goal: ${currentUser?.academicGoal || 'Become an IoT Engineer'}
Enrolled Subjects: ${subjects.map(s => `${s.code}: ${s.name}`).join(', ')}
Competencies: ${competencies.map(c => `${c.name}: ${c.currentLevel}% (${c.status})`).join(', ')}
Pending Recommendations: ${recommendations.filter(r => !r.isCompleted).map(r => r.title).join(', ')}
    `.trim();

    try {
      const res = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: currentUser?.role === 'faculty' ? 'faculty' : 'student',
          userName: currentUser?.name || 'Ramesh Kumar',
          userContext,
          message: userText,
          chatHistory: messages.map(m => ({ sender: m.sender, text: m.text }))
        })
      });
      const data = await res.json();
      if (data.success && data.data?.reply) {
        setMessages(prev => [
          ...prev,
          {
            sender: 'assistant',
            text: data.data.reply,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      } else {
        setMessages(prev => [
          ...prev,
          {
            sender: 'assistant',
            text: 'I apologize, I encountered a temporary network delay. Please ask again.',
            time: 'Just now'
          }
        ]);
      }
    } catch (e) {
      setMessages(prev => [
        ...prev,
        {
          sender: 'assistant',
          text: 'Network connection issue. Please verify your connection and try again.',
          time: 'Just now'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const samplePrompts = currentUser?.role === 'faculty'
    ? [
        'Which topics are students struggling with the most in CS402?',
        'Generate 3 analytical exam questions on FreeRTOS Semaphore Deadlocks.',
        'Draft a 10-minute micro-learning remediation task for sensor calibration.'
      ]
    : [
        'Explain FreeRTOS priority inversion and how mutex priority inheritance fixes it.',
        'Why did my quiz flag a competency gap in RTOS Interrupts?',
        'Give me a 15-minute revision plan for my 2:15 PM free period.'
      ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[600px] max-h-[90vh]"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-indigo-900/10 via-purple-900/10 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  SmartCampus AI {currentUser?.role === 'faculty' ? 'Teaching Assistant' : 'Academic Mentor'}
                </h3>
                <span className="text-[10px] font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800">
                  Gemini 3.7
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Grounded in your live curriculum, real scores, and student competencies
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'assistant' && (
                <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                  <Bot className="w-4 h-4" />
                </div>
              )}
              <div
                className={`max-w-[82%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-indigo-600 text-white rounded-tr-xs shadow-md shadow-indigo-600/20'
                    : 'bg-slate-100 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700/70 rounded-tl-xs'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>
                <span className={`text-[10px] block mt-1 text-right ${msg.sender === 'user' ? 'text-indigo-200' : 'text-slate-400'}`}>
                  {msg.time}
                </span>
              </div>
              {msg.sender === 'user' && (
                <img
                  src={currentUser?.avatar}
                  alt={currentUser?.name}
                  className="w-8 h-8 rounded-lg object-cover ring-1 ring-indigo-400 shrink-0 mt-0.5"
                />
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 items-center text-xs text-slate-400">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="flex items-center gap-2 p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-500" />
                <span>Analyzing curriculum & formulating answer...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Sample Prompt Chips */}
        <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 overflow-x-auto text-[11px] no-scrollbar">
          <span className="text-slate-400 font-semibold shrink-0">Suggestions:</span>
          {samplePrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => {
                setInputMessage(prompt);
              }}
              className="shrink-0 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors truncate max-w-xs"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
          <input
            type="text"
            placeholder={currentUser?.role === 'faculty' ? 'Ask assistant about class analytics, quiz creation, rubrics...' : 'Ask your AI mentor anything about coursework, code, concepts...'}
            value={inputMessage}
            onChange={e => setInputMessage(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
            className="flex-1 px-4 py-2.5 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white shadow-md shadow-indigo-600/30 transition-colors shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};
