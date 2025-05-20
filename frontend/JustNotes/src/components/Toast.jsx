import React, { useEffect, useState } from "react";
import { LuCheck } from "react-icons/lu";
import { MdDeleteOutline, MdClose } from "react-icons/md";

const Toast = ({ isShown, message, type, onClose }) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (!isShown) return;

    setProgress(100); // reset progress when toast shows

    const interval = 30; // ms interval for smooth animation
    const totalDuration = 2500; // 3 seconds toast duration
    const decrement = (interval / totalDuration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - decrement;
      });
    }, interval);

    const timeout = setTimeout(() => {
      onClose();
    }, totalDuration);

    return () => {
      clearTimeout(timeout);
      clearInterval(timer);
    };
  }, [isShown, onClose]);

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={`fixed top-20 right-6 transition-opacity duration-500 ${
        isShown ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      } z-50`}
    >
      <div
        className={`relative min-w-[208px] bg-white border shadow-2xl rounded-md 
        after:w-[5px] after:h-full ${
          type === "delete" ? "after:bg-red-500" : "after:bg-green-500"
        } after:absolute after:left-0 after:top-0 after:rounded-l-lg`}
      >
        <button
          onClick={onClose}
          className="absolute top-1 right-1 p-1 rounded hover:bg-slate-200"
          aria-label="Close notification"
        >
          <MdClose className="text-gray-400 hover:text-gray-600" />
        </button>

        <div className="flex items-center gap-3 py-2 px-4">
          <div
            className={`w-10 h-10 flex items-center justify-center rounded-full ${
              type === "delete" ? "bg-red-100" : "bg-green-100"
            }`}
          >
            {type === "delete" ? (
              <MdDeleteOutline className="text-xl text-red-500" />
            ) : (
              <LuCheck className="text-xl text-green-500" />
            )}
          </div>

          <p className="text-sm text-slate-800">{message}</p>
        </div>

        {/* Progress bar */}
        <div
          className={`h-1 rounded-b-md ${
            type === "delete" ? "bg-red-500" : "bg-green-500"
          }`}
          style={{ width: `${progress}%`, transition: "width 30ms linear" }}
        />
      </div>
    </div>
  );
};

export default Toast;
