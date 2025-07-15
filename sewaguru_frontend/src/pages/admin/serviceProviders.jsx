import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import api from "../../api/api";
import ListItem from "../../components/listItem";
import Loader from "../../components/loader";
import ProviderDetailsModal from "../../components/providerDetailsModal";
import { getToken } from "../../utils/auth";

export default function AdminServiceProviders() {
  const hasFetched = useRef(false);

  const [loading, setLoading] = useState(true);
  const [providerList, setProviderList] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!hasFetched.current) {
      fetchUsers();
      hasFetched.current = true;
    }
  }, []);

  const handleOpenModal = (user) => {
    console.log('open')
    setSelectedUser(user);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedUser(null);
  };

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
      
      const conversationRes = await api.post('/conversations/create', {
        userId2: selectedProvider.id,
      }, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });

      
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



  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get("/user/all/provider", {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      const verifiedProviders = response.data.filter(user => user.isVerified);
      setProviderList(verifiedProviders);
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
      await api.patch(`/user/status/disable/${id}`,
        { enable: !isDisabled },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        },
      );

      
      setProviderList((prevList) =>
        prevList.map((user) =>
          user.id === id ? { ...user, isDisabled } : user
        )
      );

      toast.success(`Provider has been ${isDisabled ? "disabled" : "enabled"}.`);
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

  return (
    <div className="m-2">
      <h2 className="text-xl font-bold mb-6 text-center text-gray-800">Registered Providers</h2>

      <ul className="space-y-2">
        {providerList.map((provider) => (
          <ListItem
            onClick={() => handleOpenModal(provider)}
            key={provider.id}
            imageUrl={provider.profilePicSrc}
            name={`${provider.firstName} ${provider.lastName}`}
            registeredOn={`${provider.createdAt}`}
            disabled={provider.isDisabled}
            onAccept={() => changeUserStatus(provider.id, false)}
            onDeny={() => changeUserStatus(provider.id, true)}
            onMessage={() => handleOpenMessageModal(provider)}
          />
        ))}
      </ul>

      <ProviderDetailsModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        user={selectedUser}
      />

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