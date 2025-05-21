// ChatWindow.jsx
import { useEffect, useState, useRef } from 'react'; // Import useRef for scrolling
import api from '../../api/api';
import { socket } from '../../utils/socket';
import { getToken } from '../../utils/auth';

const ChatWindow = ({ conversationId, userId }) => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const messagesEndRef = useRef(null); // Ref for auto-scrolling

  // Scroll to the bottom of the messages div
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    // Fetch messages
    api.get(`/messages/${conversationId}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    })
    .then((res) => {
      setMessages(res.data);
    })
    .catch((error) => {
      console.error("Error fetching messages:", error);
      // Optionally display an error message to the user
    });

    // Join conversation room
    socket.emit('join_conversation', conversationId);

    // Listen for new messages
    const handleReceiveMessage = (msg) => {
      if (msg.conversationId === conversationId) {
        setMessages((prev) => [...prev, msg]);
      }
    };
    socket.on('receive_message', handleReceiveMessage);

    // Cleanup on unmount or conversationId change
    return () => {
      socket.off('receive_message', handleReceiveMessage);
    };
  }, [conversationId]); // Dependency array includes conversationId

  // Scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault(); // Prevent default form submission behavior (e.g., page reload)
    if (text.trim() === '') return; // Don't send empty messages

    socket.emit('send_message', { conversationId, senderId: userId, text });
    setText(''); // Clear input field
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg">
      {/* Messages Display Area */}
      <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500 italic">
            Start a conversation!
          </div>
        ) : (
          messages.map((m, i) => {
            // Determine if the message is from the current user
            const isMyMessage = m.senderId && m.senderId._id === userId;
            const name = `${m.senderId?.firstName || ''} ${m.senderId?.lastName || ''}`.trim() || 'Unknown User';

            return (
              <div
                key={m._id || i} // Use message _id if available, fallback to index
                className={`flex mb-4 ${isMyMessage ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md p-3 rounded-lg ${
                    isMyMessage
                      ? 'bg-blue-500 text-white rounded-br-none' // My message style
                      : 'bg-gray-200 text-gray-800 rounded-bl-none' // Other user's message style
                  }`}
                >
                  {!isMyMessage && ( // Only show sender name for others' messages
                    <div className="font-semibold text-sm mb-1">
                      {name}
                    </div>
                  )}
                  <p className="text-sm">{m.text}</p>
                  {/* Optional: Add timestamp */}
                  {/* <div className="text-xs text-right mt-1 opacity-75">
                    {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div> */}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} /> {/* Dummy div for scrolling */}
      </div>

      {/* Message Input Area */}
      <form onSubmit={sendMessage} className="p-4 border-t border-gray-200 flex items-center bg-gray-50">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type your message here..."
          className="flex-1 p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent mr-3"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={text.trim() === ''} // Disable button if input is empty
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;