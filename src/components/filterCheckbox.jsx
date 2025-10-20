import React, { useState } from "react";

const StatusFilters = () => {
  const [status, setStatus] = useState({
    member: false,
    independent: true,
  });

  const handleChange = (key) => {
    setStatus((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="flex flex-col gap-3 text-gray-300 p-4 rounded-xl w-fit">
      <h3 className="text-sm font-semibold text-gray-400">Status</h3>

      {/* Member of the United Nations */}
      <label className="flex items-center gap-2 cursor-pointer py-2 rounded-lg transition select-none">
        <div className="relative">
          <input
            type="checkbox"
            checked={status.member}
            onChange={() => handleChange("member")}
            className="peer appearance-none w-9 h-9 rounded-md border-2 border-[#D2D5DA] checked:bg-blue-500 checked:border-blue-500 transition-all duration-200"
          />
          <svg
            className="absolute left-1.5 top-1 w-6 h-6 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200 pointer-events-none"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            viewBox="0 0 24 24"
          >
            <path d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <span className="text-xl">Member of the United Nations</span>
      </label>

      {/* Independent */}
      <label className="flex items-center gap-2 cursor-pointer py-2 rounded-lg  transition select-none">
        <div className="relative">
          <input
            type="checkbox"
            checked={status.independent}
            onChange={() => handleChange("independent")}
            className="peer appearance-none w-9 h-9 rounded-md border-2 border-[#D2D5DA] checked:bg-blue-500 checked:border-blue-500 transition-all duration-200"
          />
          <svg
            className="absolute left-1.5 top-1 w-6 h-6 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200 pointer-events-none"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            viewBox="0 0 24 24"
          >
            <path d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <span className="text-xl">Independent</span>
      </label>
    </div>
  );
};

export default StatusFilters;
