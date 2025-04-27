import React from "react";

export default function UserMessages() {
  return (
    <div className="text-center text-gray-600">
      <h2 className="text-2xl font-semibold text-[#104DA3] mb-4">Messages</h2>
      {/* Later fetch messages from API */}
      <p>Messages received from admin or service providers will be listed here.</p>
    </div>
  );
}
