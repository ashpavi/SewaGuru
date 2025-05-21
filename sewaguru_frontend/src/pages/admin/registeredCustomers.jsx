import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import api from "../../api/api";
import ListItem from "../../components/listItem";
import Loader from "../../components/loader";
import { getToken } from "../../utils/auth";

export default function AdminRegisteredCustomers() {
  const hasFetched = useRef(false);

  const [loading, setLoading] = useState(true);
  const [customersList, setCustomersList] = useState([]);

  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [message, setMessage] = useState('');


  useEffect(() => {
    if (!hasFetched.current) {
      fetchUsers();
      hasFetched.current = true;
    }
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get("/user/all/customer", {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      setCustomersList(response.data);
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to fetch profile data.");
    } finally {
      setLoading(false);
    }
  };

  const changeUserStatus = async (id, isDisabled) => {
    setLoading(true);

    try {
      await api.patch(`/user/${id}/status`,
        { isDisabled },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        },
      );

      // Update local state to reflect new status
      setCustomersList((prevList) =>
        prevList.map((user) =>
          user.id === id ? { ...user, isDisabled } : user
        )
      );

      toast.success(`User has been ${isDisabled ? "disabled" : "enabled"}.`);
    } catch (e) {
      console.error("Error changing User Status:", e);
      toast.error("Failed to change user Status.");
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <Loader />;
  }


  const handleOpenMessageModal = (provider) => {
    setSelectedProvider(provider);
    setMessage('');
    setIsMessageModalOpen(true);
  };

  const handleCloseMessageModal = () => {
    setIsMessageModalOpen(false);
    setSelectedProvider(null);
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return toast.error('Please enter a message');

    try {
      // 1. Create conversation
      const conversationRes = await api.post('/conversations/create', {
        userId2: selectedProvider.id,
      }, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });

      // 2. Send message
      await api.post('/messages', {
        conversationId: conversationRes.data._id,
        content: message,
      }, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });

      toast.success('Message sent!');
      handleCloseMessageModal();
    } catch (err) {
      toast.error('Failed to send message');
      console.error(err);
    }
  };



  return (
    <div className="m-2">
      <h2 className="text-xl font-bold mb-6 text-center text-gray-800">Registered Customers</h2>

      <ul className="space-y-2">
        {customersList.map((customer) => (
          <ListItem
            key={customer.id}
            name={`${customer.firstName} ${customer.lastName}`}
            registeredOn={`${customer.createdAt}`}
            disabled={customer.isDisabled}
            onAccept={() => changeUserStatus(customer.id, false)}
            onDeny={() => changeUserStatus(customer.id, true)}
            onMessage={() => handleOpenMessageModal(customer)}
          />
        ))}
      </ul>


      {isMessageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <h2 className="text-lg font-semibold mb-4">
              Send Message to {selectedProvider?.firstName}
            </h2>
            <textarea
              className="w-full p-2 border rounded resize-none"
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
            />
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={handleCloseMessageModal}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSendMessage}
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}