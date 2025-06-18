import React from 'react'
import { StickyNote } from 'lucide-react'
import { MdAdd } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'

const EmptyCard = ({ message = "No Notes Found" }) => {
  const navigate = useNavigate()

  return (
    <div className="flex items-center justify-center min-h-[70vh] w-full px-4">
      <div className="flex flex-col items-center justify-center w-full max-w-md h-72 bg-gradient-to-br from-gray-50 via-white to-gray-100 rounded-2xl border border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out animate-fadeIn">
        <div className="bg-yellow-100 p-4 rounded-full shadow-sm mb-4">
          <StickyNote className="text-yellow-500" size={48} />
        </div>
        <h2 className="text-xl font-semibold text-gray-700">{message}</h2>
        <p className="text-sm text-gray-500 mt-2 text-center px-4">
          Looks like there's nothing here yet. Create a new note to get started.
        </p>
      </div>
    </div>
  )
}

export default EmptyCard
