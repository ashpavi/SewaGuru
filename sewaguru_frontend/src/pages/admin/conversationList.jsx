// ConversationList.jsx
import { useEffect, useState } from 'react';
import api from '../../api/api';
import { getToken } from '../../utils/auth';

const ConversationList = ({ userId, onSelect }) => {
    const [conversations, setConversations] = useState([]);

    useEffect(() => {
        api.get(`/conversations`, {
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        }).then((res) => {
            setConversations(res.data);
        });
    }, [userId]);

    return (
        <div>
            {conversations.map((conv) => (
                <div key={conv._id} onClick={() => onSelect(conv._id)}>
                    <strong>Conversation with:</strong> {conv.members.filter(id => id !== userId).join(', ')}
                </div>
            ))}
        </div>
    );
};

export default ConversationList;
