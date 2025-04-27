

export default function ProfileDetails() {
  return (
    <div className="text-center text-gray-600">
      <h2 className="text-2xl font-semibold text-[#104DA3] mb-4">Profile Details</h2>
      {/* Later show user info and Edit here */}
      <p>Full name, email, phone, location, NIC, etc. will be shown here.</p>
      <button className="mt-6 bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full shadow-md transition">
        Edit Profile
      </button>
    </div>
  );
}
