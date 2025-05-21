// MessagesView.jsx
import { useState } from 'react';
import ConversationList from './conversationList';
import ChatWindow from './chatWindow';

const MessagesView = ({ userId }) => {
  const [selectedConversationId, setSelectedConversationId] = useState(null);

  return (
    <div className="flex h-screen font-sans bg-gray-50">
      {/* Left Sidebar: Conversations */}
      <div className="w-1/3 border-r border-gray-200 overflow-y-auto bg-white shadow-md p-4">
        <h3 className="pb-4 border-b border-gray-200 mb-4 text-gray-800 text-center text-lg font-semibold">
          Your Conversations
        </h3>
        <ConversationList userId={userId} onSelect={setSelectedConversationId} />
      </div>

      {/* Right Panel: Chat Window */}
      <div className="flex-grow p-6 bg-blue-50">
        {selectedConversationId ? (
          <ChatWindow conversationId={selectedConversationId} userId={userId} />
        ) : (
          <div className="flex justify-center items-center h-full text-gray-600 text-xl text-center">
            <p>👋 Select a conversation to start chatting!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesView;