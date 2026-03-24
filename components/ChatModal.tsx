import React, { useState, useEffect, useRef } from 'react';
import { Listing, Wanted, Message, User } from '../types';
import api from '../api';
import { useLocale } from '../contexts/LocaleContext';

interface ChatModalProps {
  targetUser: string;
  item: Listing | Wanted;
  onClose: () => void;
  currentUser: User | null;
}

const ChatModal: React.FC<ChatModalProps> = ({ targetUser, item, onClose, currentUser }) => {
  const { t } = useLocale();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  const chatRoomId = `${currentUser?.id}-${'seller' in item ? item.seller : item.author}-${item.id}`;

  useEffect(() => {
    const fetchMessages = async () => {
      const chatHistory = await api.getMessages(chatRoomId);
      if (chatHistory.length === 0 && currentUser) {
          // Start the conversation if it's new
          const initialMessage: Message = {
            id: Date.now(),
            text: t('chatInitialMessage', { name: item.name || item.location }),
            sender: currentUser.name,
            timestamp: new Date().toISOString(),
          };
          await api.sendMessage(chatRoomId, initialMessage);
          setMessages([initialMessage]);
      } else {
        setMessages(chatHistory);
      }
    };
    fetchMessages();

    const intervalId = setInterval(fetchMessages, 2000);

    return () => clearInterval(intervalId);
  }, [chatRoomId, currentUser, item.name, item.location, t]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '' || !currentUser) return;
    
    const message: Message = {
      id: Date.now(),
      text: newMessage,
      sender: currentUser.name,
      timestamp: new Date().toISOString(),
    };
    
    await api.sendMessage(chatRoomId, message);
    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg h-[70vh] flex flex-col animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b flex justify-between items-center bg-gray-50 rounded-t-2xl">
          <h2 className="text-lg font-bold text-primary-dark">{t('chatWithUser', { name: targetUser })}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="flex-grow p-4 overflow-y-auto bg-gray-100">
          <div className="space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === currentUser?.name ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${msg.sender === currentUser?.name ? 'bg-primary text-white' : 'bg-gray-200 text-gray-800'}`}>
                  <p>{msg.text}</p>
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
        </div>
        
        <form onSubmit={handleSendMessage} className="p-4 border-t">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={t('placeholderChatMessage')}
              className="flex-grow p-3 border rounded-full focus:ring-2 focus:ring-primary-light focus:border-transparent"
            />
            <button type="submit" className="px-6 py-2 bg-primary text-white rounded-full hover:bg-primary-dark transition-colors font-semibold">
              {t('send')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatModal;