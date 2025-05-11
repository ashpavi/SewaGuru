import React from 'react';

const ProviderDetailsModal = ({ isOpen, onClose, user }) => {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-6 relative max-h-[90vh] overflow-y-auto"> 
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-400 hover:text-gray-700 text-2xl"
        >
          &times;
        </button>
        <h3 className="text-2xl font-bold text-blue-600 mb-6 text-center">
          Provider Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <Detail label="Full Name" value={`${user.firstName} ${user.lastName}`} />
          <Detail label="Email" value={user.email} />
          <Detail label="Phone" value={user.phone} />
          <Detail label="NIC" value={user.nic} />
          <Detail label="Service Type" value={user.serviceType?.replace(/_/g, ' ')} />
          <Detail label="Rating" value={`${user.rating?.toFixed(1)} (${user.numberOfRatings} ratings)`} />
          <Detail label="Address" value={user.address} />
          <Detail label="Location" value={user.location} />
        </div>

        <div className="mt-6 space-y-4">
          <ImageGroup title="Profile Picture" srcs={[user.profilePicSrc]} />
          <ImageGroup title="NIC Images" srcs={user.nicImgSrc} />
          <ImageGroup title="GS Certificate" srcs={[user.gsCertSrc]} />
          <ImageGroup title="Police Certificate" srcs={[user.policeCertSrc]} />
          {user.otherSrc?.length > 0 && <ImageGroup title="Other Documents" srcs={user.otherSrc} />}
        </div>
      </div>
    </div>
  );
};

const Detail = ({ label, value }) => (
  <div>
    <p className="text-gray-500 font-semibold">{label}</p>
    <p className="text-gray-800">{value || 'Not Provided'}</p>
  </div>
);

const ImageGroup = ({ title, srcs = [] }) => (
  <div>
    <h4 className="text-gray-600 font-medium mb-2">{title}</h4>
    <div className="flex flex-wrap gap-3">
      {srcs.map((src, idx) => (
        <img
          key={idx}
          src={src}
          alt={`${title} ${idx + 1}`}
          className="w-32 h-32 object-cover rounded-md border shadow"
        />
      ))}
    </div>
  </div>
);

export default ProviderDetailsModal;
