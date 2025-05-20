import React from 'react'
import { FaMagnifyingGlass } from 'react-icons/fa6'
import { IoMdClose } from 'react-icons/io'

const SearchBar = ({ value, onChange, handleSearch, onClearSearch }) => {
  return (
    <div className="flex items-center w-full max-w-xs sm:max-w-sm md:max-w-md bg-slate-100 rounded-md px-3 py-2 shadow-sm">
      <input
        type="text"
        placeholder="Search notes..."
        value={value}
        onChange={onChange}
        className="flex-grow bg-transparent text-sm text-zinc-800 placeholder:text-zinc-500 focus:outline-none"
      />

      {/* Clear Icon */}
      {value && (
        <IoMdClose
          className="text-lg text-zinc-400 hover:text-zinc-700 cursor-pointer mx-2 transition"
          onClick={onClearSearch}
        />
      )}

      {/* Search Icon */}
      <FaMagnifyingGlass
        className="text-zinc-400 hover:text-blue-600 cursor-pointer transition"
        onClick={handleSearch}
      />
    </div>
  )
}

export default SearchBar
