import React, { useState } from 'react'
import TagInput from '../components/TagInput'
import { MdClose } from 'react-icons/md'
import axiosInstance from '../utils/axiosInstance'

const AddEditNotes = ({ noteData, type, onClose, getAllNotes, showToastMessage }) => {

    const [title, setTitle] = useState(noteData?.title || "")
    const [content, setContent] = useState(noteData?.content || "")
    const [tags, setTags] = useState(noteData?.tags || [])

    const [error, setError] = useState(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const addNewNote = async () => {
        setIsSubmitting(true)
        try {
            const response = await axiosInstance.post("/add-note", {
                title,
                content,
                tags
            })

            if (response.data && response.data.note) {
                showToastMessage(response.data.message)
                getAllNotes()
                onClose()
            }
        } catch (error) {
            if (error.response?.data?.message) {
                setError(error.response.data.message)
            }
        } finally {
            setIsSubmitting(false)
        }
    }

    const editNote = async () => {
        setIsSubmitting(true)
        const noteId = noteData._id
        try {
            const response = await axiosInstance.put("/edit-note/" + noteId, {
                title,
                content,
                tags
            })

            if (response.data && response.data.note) {
                showToastMessage(response.data.message)
                getAllNotes()
                onClose()
            }
        } catch (error) {
            if (error.response?.data?.message) {
                setError(error.response.data.message)
            }
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleAddNote = () => {
        if (!title.trim()) {
            setError("Please enter title!")
            return;
        }

        if (!content.trim()) {
            setError("Please enter content!")
            return;
        }

        setError("")

        if (type === "edit") {
            editNote()
        } else {
            addNewNote()
        }
    }

    // Reset error when user types in inputs
    const onTitleChange = (e) => {
        setTitle(e.target.value)
        if (error) setError(null)
    }
    const onContentChange = (e) => {
        setContent(e.target.value)
        if (error) setError(null)
    }

    return (
        <div className='relative'>
            <button
                className='w-10 h-10 rounded-full flex items-center justify-center absolute -top-3 -right-3 hover:bg-slate-50'
                onClick={onClose}
                disabled={isSubmitting}
            >
                <MdClose className='text-xl text-slate-400' />
            </button>

            <div className='flex flex-col gap-2'>
                <label className='input-label'>TITLE</label>
                <input
                    type='text'
                    className='text-2xl text-slate-950 outline-none'
                    placeholder='Go To Gym at 5'
                    value={title}
                    onChange={onTitleChange}
                    disabled={isSubmitting}
                />
            </div>

            <div className='flex flex-col gap-2 mt-4'>
                <label className='input-label'>CONTENT</label>
                <textarea
                    type="text"
                    className='text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded'
                    placeholder='Content'
                    rows={10}
                    value={content}
                    onChange={onContentChange}
                    disabled={isSubmitting}
                />
            </div>

            <div className='mt-3'>
                <label className='input-label'>TAGS</label>
                <TagInput tags={tags} setTags={setTags} />
            </div>

            {error && <p className='text-red-500 text-xs pt-4'>{error}</p>}

            <button
                className='btn-primary font-medium mt-5 p-3 disabled:opacity-50 disabled:cursor-not-allowed'
                onClick={handleAddNote}
                disabled={isSubmitting}
            >
                {type === 'edit' ? 'UPDATE' : 'ADD'}
            </button>
        </div>
    )
}

export default AddEditNotes
