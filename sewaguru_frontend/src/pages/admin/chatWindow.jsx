// ChatWindow.jsx
import { useEffect, useState } from 'react';
import api from '../../api/api';
import { socket } from '../../utils/socket';
import { getToken } from '../../utils/auth';

const ChatWindow = ({ conversationId, userId }) => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');

  useEffect(() => {
    api.get(`/messages/${conversationId}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }).then((res) => {
      setMessages(res.data);
    });

    socket.emit('join_conversation', conversationId);

    socket.on('receive_message', (msg) => {
      if (msg.conversationId === conversationId) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => {
      socket.off('receive_message');
    };
  }, [conversationId]);

  const sendMessage = () => {
    socket.emit('send_message', { conversationId, senderId: userId, text });
    setText('');
  };

  return (
    <div>
      <div style={{ height: '300px', overflowY: 'scroll' }}>
        {messages.map((m, i) => {
          return (
            <div key={i}>
              <b>{m.sender?.name || 'Unknown'}:</b> {m.text}
            </div>
          );
        })}
      </div>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a message"
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default ChatWindow;
