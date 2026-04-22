import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiMessageCircle,
  FiX,
  FiSend,
  FiUsers,
  FiBriefcase,
  FiMessageSquare,
  FiCalendar,
  FiBook,
  FiHelpCircle,
  FiHome,
  FiZap,
  FiAlertCircle
} from 'react-icons/fi';
import { RiRobotLine } from 'react-icons/ri';
import { useTheme } from '../ThemeContext';
import { apiUrl } from '../utils/globalurl';

const CHATBOT_API_URL = `${apiUrl}/api/chatbot/chat`;


const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const { theme } = useTheme();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Initial greeting
      setTimeout(() => {
        addBotMessage(
          "👋 Welcome to the Alumni Management System! I'm here to help you navigate our platform. How can I assist you today?"
        );
        setTimeout(() => {
          addBotMessage(
            "You can ask me about:\n• Alumni Network\n• Job Opportunities\n• Mentorship Programs\n• Forums & Events\n• News & Updates\n• Or anything else about the platform!"
          );
        }, 500);
      }, 300);
    }
  }, [isOpen]);

  const addBotMessage = (text) => {
    setMessages(prev => [...prev, { type: 'bot', text, timestamp: new Date() }]);
  };

  const addUserMessage = (text) => {
    setMessages(prev => [...prev, { type: 'user', text, timestamp: new Date() }]);
  };

  const callGeminiAPI = async (userMessage) => {
    try {
      setError(null);

      const response = await fetch(CHATBOT_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userMessage,
          history: messages.map((msg) => ({ type: msg.type, text: msg.text })),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMsg =
          (typeof errorData?.error === 'string' && errorData.error) ||
          errorData?.error?.message ||
          'Failed to get response from AI';
        throw new Error(errorMsg);
      }

      const data = await response.json();

      if (data.reply) {
        const botResponse = data.reply.trim();
        return botResponse;
      } else {
        throw new Error('No response from AI');
      }
    } catch (err) {
      console.error('Gemini API Error:', err);
      setError(err.message);
      return `I'm having trouble accessing my AI brain right now. Error: ${err.message}. Please try again in a moment! 🤖`;
    }
  };

  const handleQuickAction = (action) => {
    addUserMessage(action);
    setIsTyping(true);
    setError(null);
    setTimeout(async () => {
      const response = await callGeminiAPI(action);
      setIsTyping(false);
      setTimeout(() => {
        addBotMessage(response);
      }, 100);
    }, 800);
  };

  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;

    addUserMessage(inputValue);
    const userInput = inputValue;
    setInputValue('');

    setIsTyping(true);
    setError(null);
    setTimeout(async () => {
      const response = await callGeminiAPI(userInput);
      setIsTyping(false);
      setTimeout(() => {
        addBotMessage(response);
      }, 100);
    }, 800);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickActions = [
    { icon: FiHome, label: 'Getting Started', action: 'How do I get started?' },
    { icon: FiUsers, label: 'Alumni Network', action: 'Tell me about alumni network' },
    { icon: FiBriefcase, label: 'Jobs', action: 'What job opportunities are available?' },
    { icon: FiBook, label: 'Mentorship', action: 'How does mentorship work?' },
    { icon: FiMessageSquare, label: 'Forums', action: 'Tell me about forums' },
    { icon: FiCalendar, label: 'Events', action: 'What events are coming up?' },
  ];

  const isDark = theme === 'dark';

  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 10000 }}>
      {/* Chat Widget Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1, rotate: [0, -10, 10, -10, 0] }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            style={{
              padding: '12px',
              borderRadius: '9999px',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: isDark
                ? 'linear-gradient(135deg, #2563eb, #9333ea, #db2777)'
                : 'linear-gradient(135deg, #3b82f6, #4f46e5, #7c3aed)',
              boxShadow: isDark
                ? '0 10px 40px rgba(59, 130, 246, 0.5), 0 0 20px rgba(168, 85, 247, 0.3)'
                : '0 10px 40px rgba(99, 102, 241, 0.4), 0 0 15px rgba(139, 92, 246, 0.3)',
              position: 'relative',
              overflow: 'hidden'
            }}
            aria-label="Open chatbot"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to right, transparent, rgba(255, 255, 255, 0.1), transparent)'
              }}
            />
            <img
              src="/robot-bot.png"
              alt="AI Assistant"
              style={{
                width: '36px',
                height: '36px',
                objectFit: 'contain',
                position: 'relative',
                zIndex: 10,
                borderRadius: '50%'
              }}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextElementSibling.style.display = 'block';
              }}
            />
            <RiRobotLine style={{ width: '32px', height: '32px', color: 'white', position: 'relative', zIndex: 10, display: 'none' }} />
            <span style={{
              position: 'absolute',
              top: '2px',
              right: '2px',
              width: '10px',
              height: '10px',
              background: '#4ade80',
              borderRadius: '50%',
              boxShadow: '0 0 10px rgba(74, 222, 128, 0.8)',
              zIndex: 20
            }}></span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            style={{
              position: 'absolute',
              bottom: '0',
              right: '0',
              width: '384px',
              height: '600px',
              borderRadius: '16px',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: isDark ? '1px solid rgba(55, 65, 81, 0.5)' : '1px solid rgba(229, 231, 235, 0.5)',
              backgroundColor: isDark ? 'rgba(17, 24, 39, 0.98)' : 'rgba(255, 255, 255, 0.98)',
              boxShadow: isDark
                ? '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 30px rgba(59, 130, 246, 0.3)'
                : '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 20px rgba(99, 102, 241, 0.2)',
              maxWidth: 'calc(100vw - 48px)',
              maxHeight: 'calc(100vh - 48px)'
            }}
          >
            {/* Header */}
            <div style={{
              padding: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'between',
              position: 'relative',
              overflow: 'hidden',
              background: isDark
                ? 'linear-gradient(to right, #2563eb, #9333ea, #db2777)'
                : 'linear-gradient(to right, #3b82f6, #4f46e5, #7c3aed)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden'
                }}>
                  <img src="/robot-bot.png" alt="AI" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
                <div>
                  <h3 style={{ margin: 0, color: 'white', fontWeight: 'bold', fontSize: '1.125rem' }}>AI Assistant</h3>
                  <p style={{ margin: 0, color: 'rgba(255,255,255,0.9)', fontSize: '0.75rem' }}>🟢 Online • Powered by Gemini</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer',
                  padding: '8px',
                  borderRadius: '8px'
                }}
              >
                <FiX size={20} />
              </button>
            </div>

            {/* Messages */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              backgroundColor: isDark ? '#111827' : '#f9fafb'
            }}>
              {messages.map((message, index) => (
                <div key={index} style={{
                  display: 'flex',
                  justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start',
                  gap: '8px'
                }}>
                  {message.type === 'bot' && (
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      overflow: 'hidden',
                      backgroundColor: isDark ? '#374151' : '#e5e7eb',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <img src="/robot-bot.png" alt="AI" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    </div>
                  )}
                  <div style={{
                    maxWidth: '80%',
                    padding: '12px 16px',
                    borderRadius: '16px',
                    fontSize: '0.875rem',
                    lineHeight: '1.5',
                    backgroundColor: message.type === 'user'
                      ? (isDark ? '#2563eb' : '#3b82f6')
                      : (isDark ? '#374151' : 'white'),
                    color: message.type === 'user' ? 'white' : (isDark ? '#f3f4f6' : '#1f2937'),
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    border: message.type === 'bot' ? (isDark ? '1px solid #4b5563' : '1px solid #e5e7eb') : 'none'
                  }}>
                    {message.text}
                  </div>
                </div>
              ))}
              {isTyping && <div style={{ color: isDark ? '#9ca3af' : '#6b7280', fontSize: '0.75rem' }}>AI is typing...</div>}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div style={{
              padding: '16px',
              borderTop: isDark ? '1px solid #374151' : '1px solid #e5e7eb',
              backgroundColor: isDark ? '#111827' : 'white'
            }}>
              <div style={{
                display: 'flex',
                gap: '8px',
                alignItems: 'center',
                backgroundColor: isDark ? '#1f2937' : '#f3f4f6',
                padding: '8px 12px',
                borderRadius: '12px'
              }}>
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything..."
                  style={{
                    flex: 1,
                    background: 'none',
                    border: 'none',
                    outline: 'none',
                    color: isDark ? 'white' : '#1f2937',
                    fontSize: '0.875rem'
                  }}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim()}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: !inputValue.trim() ? '#9ca3af' : (isDark ? '#60a5fa' : '#3b82f6'),
                    cursor: inputValue.trim() ? 'pointer' : 'default'
                  }}
                >
                  <FiSend size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Chatbot;
