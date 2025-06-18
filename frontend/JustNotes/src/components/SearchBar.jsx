import React from 'react'
import { FaMagnifyingGlass } from 'react-icons/fa6'
import { IoMdClose } from 'react-icons/io'

const SearchBar = ({ value, onChange, handleSearch, onClearSearch }) => {
  return (
    <div className="flex items-center w-full max-w-full sm:max-w-sm md:max-w-md bg-slate-100 rounded-md px-3 py-2 shadow-sm">
      <input
        type="text"
        placeholder="Search notes..."
        value={value}
        onChange={onChange}
        className="flex-grow bg-transparent text-sm sm:text-base text-zinc-800 placeholder:text-zinc-500 focus:outline-none"
      />

      {/* Icons Container */}
      <div className="flex items-center gap-2 flex-shrink-0 ml-2">
        {value && (
          <IoMdClose
            className="text-xl text-zinc-400 hover:text-zinc-700 cursor-pointer transition"
            onClick={onClearSearch}
          />
        )}

        <FaMagnifyingGlass
          className="text-xl text-zinc-500 hover:text-blue-600 cursor-pointer transition"
          onClick={handleSearch}
        />
      </div>
    </div>
  )
}

export default SearchBar
