import React, { useState, useRef, useEffect } from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import { ChatMessage, View } from '../../types';
import { chat as chatAgent, ChatAgentMessage } from '../../services/agents/financialChatAgent';
import { SparklesIcon } from '../ui/Icon';
import Button from '../ui/Button';

interface ChatDashboardProps {
  setCurrentView: (view: View) => void;
}

const TypingIndicator: React.FC = () => (
  <div className="flex items-end gap-2 mb-4">
    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-sm flex-shrink-0">
      🤖
    </div>
    <div className="bg-slate-700 rounded-2xl rounded-bl-none px-4 py-3">
      <div className="flex gap-1 items-center h-4">
        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  </div>
);

const ChatDashboard: React.FC<ChatDashboardProps> = ({ setCurrentView }) => {
  const {
    chatMessages,
    addChatMessage,
    currentUser,
    income,
    budgetCategories,
    transactions,
    savingsBalance,
  } = useAppContext();

  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isTyping]);

  const handleSend = async () => {
    const text = inputText.trim();
    if (!text || isTyping) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}-u`,
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
      memberId: currentUser.id,
    };
    addChatMessage(userMsg);
    setInputText('');
    setIsTyping(true);

    try {
      // Build history (all messages except the one just added)
      const history: ChatAgentMessage[] = chatMessages.map(m => ({
        role: m.role,
        content: m.content,
      }));

      const reply = await chatAgent(text, history, {
        currentUser,
        income,
        categories: budgetCategories,
        transactions,
        savingsBalance,
      });

      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now()}-a`,
        role: 'assistant',
        content: reply,
        timestamp: new Date().toISOString(),
        memberId: 'ai',
      };
      addChatMessage(assistantMsg);
    } catch (err) {
      console.error('Chat error:', err);
      addChatMessage({
        id: `msg-${Date.now()}-err`,
        role: 'assistant',
        content: "Sorry, I'm having trouble right now. Please try again in a moment.",
        timestamp: new Date().toISOString(),
        memberId: 'ai',
      });
    } finally {
      setIsTyping(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const suggestions = [
    'How is our budget looking this month?',
    'Where are we overspending?',
    'How can we save more money?',
    'Give me a tip to reduce dining costs.',
  ];

  return (
    <div className="flex flex-col h-screen bg-slate-900">
      {/* Header */}
      <header className="flex items-center gap-4 p-4 border-b border-slate-700 flex-shrink-0">
        <button
          onClick={() => setCurrentView('home')}
          className="p-2 rounded-lg hover:bg-slate-700 transition-colors"
          title="Go to Home"
        >
          <span className="text-3xl">🏠</span>
        </button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
            🤖
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">AI Budget Assistant</h1>
            <p className="text-xs text-slate-400">Powered by GPT-4o-mini · Knows your finances</p>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-grow overflow-y-auto p-4 space-y-1 pb-2">
        {chatMessages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center px-4 py-8">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-3xl mb-4">
              🤖
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Hi, {currentUser.name}! 👋</h2>
            <p className="text-slate-400 mb-6 max-w-sm">
              I'm your personal financial assistant. I know your budget, spending, and savings.
              Ask me anything!
            </p>
            <div className="grid grid-cols-1 gap-2 w-full max-w-sm">
              {suggestions.map(s => (
                <button
                  key={s}
                  onClick={() => { setInputText(s); inputRef.current?.focus(); }}
                  className="text-left px-4 py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {chatMessages.map(msg => (
          <div
            key={msg.id}
            className={`flex items-end gap-2 mb-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 ${
              msg.role === 'user'
                ? 'bg-gradient-to-br from-blue-500 to-purple-600'
                : 'bg-gradient-to-br from-purple-500 to-blue-500'
            }`}>
              {msg.role === 'user' ? currentUser.avatar : '🤖'}
            </div>
            <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm whitespace-pre-wrap break-words ${
              msg.role === 'user'
                ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-br-none'
                : 'bg-slate-700 text-slate-200 rounded-bl-none'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}

        {isTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex-shrink-0 p-4 border-t border-slate-700 bg-slate-800/80 backdrop-blur-sm">
        <div className="flex gap-2 items-center max-w-4xl mx-auto">
          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about your budget, savings, spending..."
            disabled={isTyping}
            className="flex-grow p-3 bg-slate-700 rounded-xl border border-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-slate-400 disabled:opacity-50 text-sm"
          />
          <Button
            onClick={handleSend}
            disabled={!inputText.trim() || isTyping}
            className="flex-shrink-0 px-4 py-3"
          >
            <SparklesIcon className="w-5 h-5" />
            {isTyping ? 'Thinking...' : 'Send'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatDashboard;
