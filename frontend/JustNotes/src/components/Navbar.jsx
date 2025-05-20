import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ProfileInfo from './ProfileInfo'
import SearchBar from './SearchBar'

const Navbar = ({ userInfo, onSearchNote, handleClearSearch }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  const onLogout = () => {
    localStorage.clear()
    navigate('/')
  }

  const handleSearch = () => {
    if (searchQuery.trim()) {
      onSearchNote(searchQuery.trim())
    }
  }

  const onClearSearch = () => {
    setSearchQuery('')
    handleClearSearch()
  }

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Logo / Brand */}
        <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">
          Just <span className="text-blue-600">Notes</span>
        </h1>

        {/* Search Bar */}
        <SearchBar
          value={searchQuery}
          onChange={({ target }) => setSearchQuery(target.value)}
          handleSearch={handleSearch}
          onClearSearch={onClearSearch}
        />

        {/* Profile Info */}
        <ProfileInfo userInfo={userInfo} onLogout={onLogout} />
      </div>
    </header>
  )
}

export default Navbar
