import React from 'react'
import { getInitials } from '../utils/helper'

const ProfileInfo = ({ onLogout, userInfo }) => {
  if (!userInfo) return null // Prevent rendering until userInfo is available

  const { fullName } = userInfo

  return (
    <div className="flex items-center gap-4">
      {/* Avatar Initials */}
      <div
        title={fullName}
        className="w-16 h-16 sm:w-11 sm:h-11 flex items-center justify-center rounded-full bg-slate-100 text-slate-900 font-semibold text-sm shadow-sm"
      >
        {getInitials(fullName)}
      </div>

      {/* Name + Logout */}
      <div className="text-right">
        <p className="text-sm font-medium text-zinc-800">{fullName}</p>
        <button
          onClick={onLogout}
          aria-label="Logout"
          className="text-sm text-blue-600 hover:underline hover:text-blue-700 transition"
        >
          Logout
        </button>
      </div>
    </div>
  )
}

export default ProfileInfo
