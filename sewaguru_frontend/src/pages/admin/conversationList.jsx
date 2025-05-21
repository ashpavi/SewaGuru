// ConversationList.jsx
import { useEffect, useState } from 'react';
import api from '../../api/api';
import { getToken } from '../../utils/auth';

const ConversationList = ({ userId, onSelect, selectedConversationId }) => { // Added selectedConversationId prop
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchConversations = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await api.get(`/conversations`, {
                    headers: {
                        Authorization: `Bearer ${getToken()}`,
                    },
                });
                setConversations(res.data);
            } catch (err) {
                console.error("Error fetching conversations:", err);
                setError("Failed to load conversations. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchConversations();
    }, [userId]);

    if (loading) {
        return (
            <div className="text-center py-4 text-gray-500">
                Loading conversations...
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-4 text-red-500">
                {error}
            </div>
        );
    }

    if (conversations.length === 0) {
        return (
            <div className="text-center py-4 text-gray-500 italic">
                No conversations found.
            </div>
        );
    }

    return (
        <div className="space-y-2"> {/* Adds vertical space between items */}
            {conversations.map((conv) => {
                // Determine the other participant in the conversation
                const otherMember = conv.members.find(member => member._id !== userId);
                const participantName = otherMember
                    ? `${otherMember.firstName || ''} ${otherMember.lastName || ''}`.trim()
                    : 'Unknown User';
                const participantRole = otherMember?.role || 'User';

                const isActive = selectedConversationId === conv._id;

                return (
                    <div
                        key={conv._id}
                        onClick={() => onSelect(conv._id)}
                        className={`
                            flex items-center p-3 rounded-lg cursor-pointer
                            transition-all duration-200 ease-in-out
                            ${isActive
                                ? 'bg-blue-100 border-l-4 border-blue-500 shadow-sm'
                                : 'bg-gray-50 hover:bg-gray-100'
                            }
                        `}
                    >
                        {/* Optional: Add a simple avatar/initials placeholder */}
                        <div className={`
                            w-10 h-10 rounded-full flex items-center justify-center mr-3
                            ${isActive ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}
                            font-bold text-sm uppercase
                        `}>
                            {participantName.charAt(0) || '?'}
                        </div>
                        <div>
                            <div className="font-semibold text-gray-800 text-base leading-tight">
                                {participantName}
                            </div>
                            <div className="text-sm text-gray-600">
                                {participantRole}
                            </div>
                            {/* Optional: Display last message snippet */}
                            {/* {conv.lastMessage && (
                                <div className="text-xs text-gray-500 truncate mt-1">
                                    {conv.lastMessage.text}
                                </div>
                            )} */}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default ConversationList;