import React, { useState } from 'react';
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

const PasswordInput = ({ value, onChange, placeholder = "Password", id, name }) => {
  const [isShowPassword, setIsShowPassword] = useState(false);

  const toggleShowPassword = () => setIsShowPassword(prev => !prev);

  return (
    <div className="flex items-center border-[1.5px] border-slate-300 rounded mb-4 px-5 bg-transparent focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-300 focus-within:ring-opacity-50">
      <input
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        type={isShowPassword ? "text" : "password"}
        placeholder={placeholder}
        className="w-full py-3 text-sm bg-transparent outline-none placeholder:text-slate-400"
        aria-label="Password"
        autoComplete="current-password"
      />
      <button
        type="button"
        onClick={toggleShowPassword}
        aria-pressed={isShowPassword}
        aria-label={isShowPassword ? "Hide password" : "Show password"}
        className="text-blue-500 hover:text-blue-600 focus:outline-none"
      >
        {isShowPassword ? <FaRegEye size={22} /> : <FaRegEyeSlash size={22} />}
      </button>
    </div>
  );
};

export default PasswordInput;
