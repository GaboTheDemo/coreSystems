// src/components/SellerChatWidget/SellerChatWidget.tsx
import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '../../context/ChatContext';
import styles from './SellerChatWidget.module.css';

const SELLER_NAME = 'Thomas';
const SELLER_INITIAL = 'T';
const BUYER_INITIAL = 'Y';
const BUYER_DISPLAY = 'Customer';

const SellerChatWidget: React.FC = () => {
  const { messages, sellerUnread, sendMessage, markAsRead } = useChat();
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      markAsRead('seller');
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen, markAsRead]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      markAsRead('seller');
    }
  }, [messages, isOpen, markAsRead]);

  const formatTime = (date: Date) =>
    date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const handleSend = () => {
    const text = inputValue.trim();
    if (!text) return;
    sendMessage(text, 'seller', SELLER_NAME);
    setInputValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className={styles.widgetRoot}>
      {isOpen && (
        <div className={styles.chatWindow}>
          {/* Header */}
          <div className={styles.chatHeader}>
            <div className={styles.headerLeft}>
              <div className={styles.buyerAvatar}>{BUYER_INITIAL}</div>
              <div className={styles.headerInfo}>
                <span className={styles.headerName}>{BUYER_DISPLAY}</span>
                <span className={styles.headerStatus}>
                  <span className={styles.onlineDot} /> Active now
                </span>
              </div>
            </div>
            <div className={styles.headerActions}>
              <button className={styles.headerBtn} aria-label="Search">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
              </button>
              <button className={styles.headerBtn} aria-label="Delete">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                  <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
                </svg>
              </button>
              <button className={styles.closeBtn} onClick={() => setIsOpen(false)} aria-label="Close">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Body */}
          <div className={styles.chatBody}>
            <aside className={styles.sidebar}>
              <div className={styles.sidebarGrid} />
              <div className={styles.sidebarAvatarBottom}>
                <div className={styles.sellerAvatarSm}>{SELLER_INITIAL}</div>
              </div>
            </aside>

            <div className={styles.messages}>
              {messages.map(msg => {
                // From seller's POV: seller messages appear on the right (as "me")
                const isMe = msg.sender === 'seller';
                return (
                  <div
                    key={msg.id}
                    className={`${styles.messageRow} ${isMe ? styles.messageRowMe : styles.messageRowOther}`}
                  >
                    {!isMe && (
                      <div className={styles.msgAvatar}>{BUYER_INITIAL}</div>
                    )}
                    <div className={styles.messageWrap}>
                      <div className={`${styles.bubble} ${isMe ? styles.bubbleMe : styles.bubbleOther}`}>
                        {msg.text}
                      </div>
                      <div className={`${styles.msgMeta} ${isMe ? styles.msgMetaRight : ''}`}>
                        <button className={styles.shareBtn} aria-label="Share">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                            <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                          </svg>
                        </button>
                        <span className={styles.msgTime}>{formatTime(msg.timestamp)}</span>
                      </div>
                    </div>
                    {isMe && (
                      <div className={styles.msgAvatar}>{SELLER_INITIAL}</div>
                    )}
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input */}
          <div className={styles.chatInput}>
            <input
              ref={inputRef}
              className={styles.textInput}
              type="text"
              placeholder="Reply to customer..."
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <div className={styles.inputActions}>
              <button className={styles.inputActionBtn} aria-label="Attach">
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
              <button className={styles.sendBtn} onClick={handleSend} aria-label="Send" disabled={!inputValue.trim()}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <line x1="22" y1="2" x2="11" y2="13"/>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FAB */}
      <button
        className={`${styles.fab} ${isOpen ? styles.fabOpen : ''}`}
        onClick={() => setIsOpen(o => !o)}
        aria-label="Customer messages"
      >
        {isOpen ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        ) : (
          <>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            <span className={styles.fabLabel}>Customer messages</span>
          </>
        )}
        {!isOpen && sellerUnread > 0 && (
          <span className={styles.fabBadge}>{sellerUnread > 9 ? '9+' : sellerUnread}</span>
        )}
      </button>
    </div>
  );
};

export default SellerChatWidget;