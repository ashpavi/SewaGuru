import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import api from "../../api/api";
import ListItem from "../../components/listItem";
import Loader from "../../components/loader";
import { token } from "../../utils/auth";

export default function AdminRegisteredCustomers() {
  const hasFetched = useRef(false);

  const [loading, setLoading] = useState(true);
  const [customersList, setCustomersList] = useState([]);

  useEffect(() => {
    if (!hasFetched.current) {
      fetchUsers();
      hasFetched.current = true;
    }
  }, []);

  useEffect(() => {
    console.log(customersList)
  }, [customersList]);


  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get("/user/all/customer", {
        headers: {
          Authorization: `Bearer ${token}`,
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
            Authorization: `Bearer ${token}`,
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
          />
        ))}
      </ul>
    </div>
  );
}