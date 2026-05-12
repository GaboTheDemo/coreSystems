// src/components/ChatWidget/ChatWidget.tsx
import React, { useState, useRef, useEffect } from 'react';
import styles from './ChatWidget.module.css';

interface Message {
  id: string;
  text: string;
  sender: 'buyer' | 'seller';
  timestamp: Date;
  avatar?: string;
  senderName: string;
}

const MOCK_SELLER = {
  name: 'Thomas',
  avatar: 'T',
  storeName: 'CoreSystems Store',
};

const MOCK_BUYER = {
  name: 'You',
  avatar: 'Y',
};

const INITIAL_MESSAGES: Message[] = [
  {
    id: '1',
    text: "Hi! My name is Thomas, I'm happy to guide you today. What can I help you with? Be sure I'll help you!",
    sender: 'seller',
    timestamp: new Date(Date.now() - 120000),
    senderName: MOCK_SELLER.name,
  },
];

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      inputRef.current?.focus();
    }
  }, [isOpen, messages]);

  const formatTime = (date: Date) =>
    date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const simulateSellerReply = (userMessage: string) => {
    setIsTyping(true);
    const replies = [
      "Great question! Let me check that for you right away.",
      "Of course! We have several options available. Let me show you.",
      "Thanks for reaching out! That product is currently in stock.",
      "Absolutely! We offer free shipping on orders over $50.",
      "I'll look into that for you. One moment please!",
    ];
    const reply = replies[Math.floor(Math.random() * replies.length)];
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          text: reply,
          sender: 'seller',
          timestamp: new Date(),
          senderName: MOCK_SELLER.name,
        },
      ]);
    }, 1400);
  };

  const handleSend = () => {
    const text = inputValue.trim();
    if (!text) return;

    const newMsg: Message = {
      id: Date.now().toString(),
      text,
      sender: 'buyer',
      timestamp: new Date(),
      senderName: MOCK_BUYER.name,
    };

    setMessages(prev => [...prev, newMsg]);
    setInputValue('');
    simulateSellerReply(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSend();
  };

  const unreadCount = 0; // extend with real unread logic

  return (
    <div className={styles.widgetRoot}>
      {/* ── Chat Window ── */}
      {isOpen && (
        <div className={styles.chatWindow}>
          {/* Header */}
          <div className={styles.chatHeader}>
            <div className={styles.headerLeft}>
              <div className={styles.sellerAvatar}>{MOCK_SELLER.avatar}</div>
              <div className={styles.headerInfo}>
                <span className={styles.headerName}>{MOCK_SELLER.storeName}</span>
                <span className={styles.headerStatus}>
                  <span className={styles.onlineDot} /> Online
                </span>
              </div>
            </div>
            <div className={styles.headerActions}>
              <button className={styles.headerBtn} aria-label="Search messages">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
              </button>
              <button className={styles.headerBtn} aria-label="Delete chat">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                  <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
                </svg>
              </button>
              <button
                className={styles.closeBtn}
                onClick={() => setIsOpen(false)}
                aria-label="Close chat"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Sidebar + Messages layout */}
          <div className={styles.chatBody}>
            {/* Left sidebar (decorative grid, mirrors reference image) */}
            <aside className={styles.sidebar}>
              <div className={styles.sidebarGrid} />
              <div className={styles.sidebarAvatarBottom}>
                <div className={styles.buyerAvatarSm}>{MOCK_BUYER.avatar}</div>
              </div>
            </aside>

            {/* Messages */}
            <div className={styles.messages}>
              {messages.map(msg => (
                <div
                  key={msg.id}
                  className={`${styles.messageRow} ${msg.sender === 'buyer' ? styles.messageRowBuyer : styles.messageRowSeller}`}
                >
                  {msg.sender === 'seller' && (
                    <div className={styles.msgAvatar}>{MOCK_SELLER.avatar}</div>
                  )}
                  <div className={styles.messageWrap}>
                    <div
                      className={`${styles.bubble} ${msg.sender === 'buyer' ? styles.bubbleBuyer : styles.bubbleSeller}`}
                    >
                      {msg.text}
                    </div>
                    <div className={`${styles.msgMeta} ${msg.sender === 'buyer' ? styles.msgMetaRight : ''}`}>
                      <button className={styles.shareBtn} aria-label="Share message">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                          <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/>
                          <circle cx="18" cy="19" r="3"/>
                          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                        </svg>
                      </button>
                      <span className={styles.msgTime}>{formatTime(msg.timestamp)}</span>
                    </div>
                  </div>
                  {msg.sender === 'buyer' && (
                    <div className={styles.msgAvatar}>{MOCK_BUYER.avatar}</div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className={`${styles.messageRow} ${styles.messageRowSeller}`}>
                  <div className={styles.msgAvatar}>{MOCK_SELLER.avatar}</div>
                  <div className={styles.typingBubble}>
                    <span /><span /><span />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input */}
          <div className={styles.chatInput}>
            <input
              ref={inputRef}
              className={styles.textInput}
              type="text"
              placeholder="Type a new message here"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <div className={styles.inputActions}>
              <button className={styles.inputActionBtn} aria-label="Attach file">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
                </svg>
              </button>
              <button className={styles.inputActionBtn} aria-label="Emoji">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M8 13s1.5 2 4 2 4-2 4-2"/>
                  <line x1="9" y1="9" x2="9.01" y2="9"/>
                  <line x1="15" y1="9" x2="15.01" y2="9"/>
                </svg>
              </button>
              <button
                className={styles.sendBtn}
                onClick={handleSend}
                aria-label="Send message"
                disabled={!inputValue.trim()}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <line x1="22" y1="2" x2="11" y2="13"/>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── FAB Button ── */}
      <button
        className={`${styles.fab} ${isOpen ? styles.fabOpen : ''}`}
        onClick={() => setIsOpen(o => !o)}
        aria-label="Chat with seller"
      >
        {isOpen ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        )}
        {!isOpen && (
          <span className={styles.fabLabel}>Chat with us</span>
        )}
      </button>
    </div>
  );
};

export default ChatWidget;