import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import api from "../../api/api";
import ListItem from "../../components/listItem";
import Loader from "../../components/loader";
import ProviderDetailsModal from "../../components/providerDetailsModal";

export default function AdminServiceProviders() {
  const hasFetched = useRef(false);

  const [loading, setLoading] = useState(true);
  const [providerList, setProviderList] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (!hasFetched.current) {
      fetchUsers();
      hasFetched.current = true;
    }
  }, []);

  useEffect(() => {
    console.log(providerList)
  }, [providerList]);

  const handleOpenModal = (user) => {
    console.log('open')
    setSelectedUser(user);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedUser(null);
  };


  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await api.get("/user/all/provider", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProviderList(response.data);
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
      const token = localStorage.getItem("accessToken");
      await api.patch(`/user/${id}/status`,
        { isDisabled },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // Update local state to reflect new status
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
          />
        ))}
      </ul>

      <ProviderDetailsModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        user={selectedUser}
      />
    </div>
  );
}