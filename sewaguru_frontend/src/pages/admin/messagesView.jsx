// MessagesView.jsx
import { useState } from 'react';
import ConversationList from './conversationList';
import ChatWindow from './chatWindow';

const MessagesView = ({ userId }) => {
  const [selectedConversationId, setSelectedConversationId] = useState(null);

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Left Sidebar: Conversations */}
      <div style={{ width: '30%', borderRight: '1px solid #ccc', overflowY: 'auto' }}>
        <h3>Your Conversations</h3>
        <ConversationList userId={userId} onSelect={setSelectedConversationId} />
      </div>

      {/* Right Panel: Chat Window */}
      <div style={{ flexGrow: 1, padding: '1rem' }}>
        {selectedConversationId ? (
          <ChatWindow conversationId={selectedConversationId} userId={userId} />
        ) : (
          <div>Select a conversation to view messages</div>
        )}
      </div>
    </div>
  );
};

export default MessagesView;
