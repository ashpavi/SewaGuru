import React, { useState } from "react";

export default function Testing() {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("");

  const frequencies = [
    "Just once",
    "Every week",
    "Every 2 weeks",
    "Once a month"
  ];

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Open Frequency Form
      </button>

      {/* Overlay and Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl relative">
            {/* Title */}
            <h2 className="text-xl font-semibold text-center mb-4">
              How often do you want the house cleaned?
            </h2>

            {/* Radio Options */}
            <div className="space-y-3">
              {frequencies.map((freq) => (
                <label
                  key={freq}
                  className={`flex items-center border px-4 py-2 rounded-md cursor-pointer transition-all ${
                    selected === freq
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="frequency"
                    value={freq}
                    checked={selected === freq}
                    onChange={() => setSelected(freq)}
                    className="mr-3"
                  />
                  {freq}
                </label>
              ))}
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-between items-center mt-6">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 text-gray-600 border rounded-md hover:bg-gray-100"
              >
                Skip
              </button>
              <button
                onClick={() => {
                  console.log("Selected:", selected);
                  setIsOpen(false);
                }}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Next
              </button>
            </div>

            {/* Close Button (Top Right) */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </>
  );
}
