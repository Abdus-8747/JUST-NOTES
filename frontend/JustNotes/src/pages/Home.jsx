import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import NoteCard from '../components/NoteCard'
import { MdAdd } from 'react-icons/md'
import AddEditNotes from './AddEditNotes'
import Modal from "react-modal"
import moment from "moment"
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../utils/axiosInstance'
import Toast from '../components/Toast'
import EmptyCard from '../components/EmptyCard'
import { Link } from 'react-router-dom'

const Home = () => {
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null
  })

  const [showToastMsg, setShowToastMsg] = useState({
    isShown: false,
    message: "",
    type: "add"
  })

  const [allNotes, setAllNotes] = useState([])
  const [userInfo, setUserInfo] = useState(null)
  const [isSearch, setIsSearch] = useState(false)

  const navigate = useNavigate()

  const handleEdit = (noteDetails) => {
    setOpenAddEditModal({ isShown: true, data: noteDetails, type: "edit" })
  }

  const showToastMessage = (message, type = "add") => {
    setShowToastMsg({
      isShown: true,
      message,
      type
    })
  }

  const handleCloseToast = () => {
    setShowToastMsg({
      isShown: false,
      message: ""
    })
  }

  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user")
      if (response.data && response.data.user) {
        setUserInfo(response.data.user)
      }
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.clear()
        navigate("/login")
      }
    }
  }

  const getAllNotes = async () => {
    try {
      const response = await axiosInstance.get("/get-all-notes")
      if (response.data && response.data.notes) {
        setAllNotes(response.data.notes)
      }
    } catch (error) {
      console.error("An unexpected error occurred, please try again.")
    }
  }

  const deleteNote = async (noteData) => {
    try {
      const response = await axiosInstance.delete("/delete-note/" + noteData._id)
      if (response.data && !response.data.error) {
        showToastMessage(response.data.message, 'delete')
        getAllNotes()
      }
    } catch {
      console.error("An unexpected error occurred, please try again.")
    }
  }

  const onSearchNote = async (query) => {
    try {
      const response = await axiosInstance.get("/search-notes", { params: { query } })
      if (response.data && response.data.notes) {
        setIsSearch(true)
        setAllNotes(response.data.notes)
      }
    } catch {
      console.error("An unexpected error occurred, please try again.")
    }
  }

  const updateIsPinned = async (noteData) => {
    try {
      const response = await axiosInstance.put(`update-note-pined/${noteData._id}`, {
        isPinned: !noteData.isPinned
      })
      if (response.data && response.data.note) {
        showToastMessage(response.data.message)
        getAllNotes()
      }
    } catch {
      console.error("An unexpected error occurred, please try again.")
    }
  }

  const handleClearSearch = () => {
    setIsSearch(false)
    getAllNotes()
  }

  useEffect(() => {
    getUserInfo()
    getAllNotes()
  }, [])

  return (
    <>
      <Navbar userInfo={userInfo} onSearchNote={onSearchNote} handleClearSearch={handleClearSearch} />

      <main className="container mx-auto px-6 sm:px-8 py-8">
        {allNotes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {allNotes.map(note => (
              <NoteCard
                key={note._id}
                title={note.title}
                date={moment(note.createdOn).format('Do MMM YYYY')}
                content={note.content}
                tags={note.tags}
                isPinned={note.isPinned}
                onEdit={() => handleEdit(note)}
                onDelete={() => deleteNote(note)}
                onPinNote={() => updateIsPinned(note)}
              />
            ))}
          </div>
        ) : (
          <EmptyCard />
        )}
      </main>

      <button
        aria-label="Add Note"
        className="fixed right-10 bottom-10 w-16 h-16 flex items-center justify-center rounded-2xl bg-blue-500 hover:bg-blue-600 shadow-lg transition-colors duration-200"
        onClick={() => setOpenAddEditModal({ isShown: true, type: "add", data: null })}
      >
        <MdAdd className="text-4xl text-white" />
      </button>

      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() => setOpenAddEditModal({ isShown: false, type: "add", data: null })}
        style={{
          overlay: { backgroundColor: "rgba(0,0,0,0.2)" },
        }}
        contentLabel={openAddEditModal.type === "add" ? "Add Note" : "Edit Note"}
        className="w-[40%] max-h-[75vh] bg-white rounded-md mx-auto mt-14 p-6 overflow-auto shadow-lg"
        ariaHideApp={false} // You can configure this according to your app setup
      >
        <AddEditNotes
          type={openAddEditModal.type}
          noteData={openAddEditModal.data}
          onClose={() => setOpenAddEditModal({ isShown: false, type: "add", data: null })}
          getAllNotes={getAllNotes}
          showToastMessage={showToastMessage}
        />
      </Modal>

      <Toast
        isShown={showToastMsg.isShown}
        message={showToastMsg.message}
        type={showToastMsg.type}
        onClose={handleCloseToast}
      />
      {/* Footer */}
<div className="fixed bottom-4 left-1/2 transform -translate-x-1/2">
  <footer className="text-center text-sm text-gray-500 py-3">
    &copy; 2025 Just Notes. Built with 💙 by{' '}
    <Link
      to="https://www.linkedin.com/in/abdus-samad-shamsi-a61161286/"
      className="text-blue-500"
      target="_blank"
      rel="noopener noreferrer"
    >
      Abdus Samad
    </Link>
    .
  </footer>
</div>

    </>
  )
}

export default Home
