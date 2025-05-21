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
            {conversations.map((conv) => {
                console.log(conv);
                return (
                    <div key={conv._id} onClick={() => onSelect(conv._id)}>
                        <strong>{conv.members[1].role}</strong> {conv.members[1].firstName} {conv.members[1].lastName}
                    </div>
                );
            })}
        </div>
    );
};

export default ConversationList;
