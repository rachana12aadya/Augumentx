import { useState, useRef, useEffect } from 'react';
import { Bot, MessageSquare, Send, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getAIResponse } from '@/data/ai-responses';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const WELCOME_MESSAGE =
  "Hello! I'm AugmentAI, your educational assistant. I can help you understand human augmentation technologies. What would you like to know?";

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: WELCOME_MESSAGE,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasPulsed, setHasPulsed] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!hasPulsed) {
      const timer = setTimeout(() => setHasPulsed(true), 3000);
      return () => clearTimeout(timer);
    }
  }, [hasPulsed]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || isTyping) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: trimmed,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const response = getAIResponse(trimmed);
      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 800);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      <div
        className={cn(
          'fixed bottom-6 right-6 z-50',
          !hasPulsed && 'animate-pulse'
        )}
      >
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className={cn(
            'group flex h-14 w-14 items-center justify-center rounded-full',
            'bg-gradient-to-br from-primary-500 to-primary-600',
            'text-white shadow-lg transition-all duration-200',
            'hover:scale-105 hover:shadow-xl',
            'focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2',
            isOpen && 'rotate-0'
          )}
          aria-label={isOpen ? 'Close chat' : 'Open AugmentAI chat'}
        >
          {isOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <MessageSquare className="h-6 w-6" />
          )}
        </button>

        <span
          className={cn(
            'pointer-events-none absolute right-full mr-3 top-1/2 -translate-y-1/2',
            'whitespace-nowrap rounded-lg bg-gray-900 px-3 py-1.5 text-sm text-white',
            'opacity-0 transition-opacity duration-200',
            'group-hover:opacity-100',
            isOpen && 'hidden'
          )}
        >
          Ask AugmentAI
        </span>
      </div>

      {isOpen && (
        <div
          className={cn(
            'fixed bottom-24 right-6 z-50 flex flex-col',
            'w-[calc(100%-2rem)] max-w-[380px]',
            'max-h-[500px] rounded-xl bg-white shadow-2xl',
            'animate-slide-up',
            'border border-gray-200'
          )}
        >
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-primary-600">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900">
                  AugmentAI
                </h3>
                <p className="text-xs text-gray-500">Educational Demo</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
              aria-label="Close chat"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mb-2 mx-3 mt-2 rounded-lg bg-amber-50 border border-amber-200 px-3 py-2">
            <p className="text-xs text-amber-700">
              AugmentAI is an educational demo and does not provide medical
              advice.
            </p>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  'animate-fade-in',
                  message.role === 'user' ? 'flex justify-end' : 'flex justify-start'
                )}
              >
                <div
                  className={cn(
                    'max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed',
                    message.role === 'user'
                      ? 'bg-primary-500 text-white rounded-br-md'
                      : 'bg-gray-100 text-gray-900 rounded-bl-md'
                  )}
                >
                  {message.content}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start animate-fade-in">
                <div className="rounded-2xl rounded-bl-md bg-gray-100 px-4 py-3">
                  <div className="flex items-center gap-1">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:0ms]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:150ms]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:300ms]" />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-gray-100 px-4 py-3">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about augmentation technologies..."
                disabled={isTyping}
                className={cn(
                  'flex-1 rounded-full border border-gray-200 bg-gray-50 px-4 py-2.5',
                  'text-sm text-gray-900 placeholder-gray-400',
                  'transition-colors duration-200',
                  'focus:border-primary-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-100',
                  'disabled:cursor-not-allowed disabled:opacity-50'
                )}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-full',
                  'bg-primary-500 text-white shadow-sm',
                  'transition-all duration-200',
                  'hover:bg-primary-600 hover:shadow-md',
                  'focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2',
                  'disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-primary-500'
                )}
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
