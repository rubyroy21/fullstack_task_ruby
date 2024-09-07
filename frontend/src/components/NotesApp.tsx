import React, { useState } from "react";
import { FaPlusCircle } from "react-icons/fa";

// Define types for props
interface NotesAppProps {
    notes: (string | { task: string })[]; // Accept both strings and objects with 'task' field
    addNote: (note: string) => void;
}

const NotesApp: React.FC<NotesAppProps> = ({ notes, addNote }) => {
    const [newNote, setNewNote] = useState<string>(''); // Type for state is string

    const handleAddNote = () => {
        if (newNote.trim()) {  // Ensure no empty note is added
            addNote(newNote);
            setNewNote(''); // Clear input after adding note
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleAddNote();
        }
    };

    return (
        <div className='flex flex-col gap-4'>
            {/* Input and button field */}
            <div className='flex flex-col sm:flex-row gap-3'>
                <input
                    type="text"
                    className='border p-2 border-gray-300 h-10 w-full sm:w-4/5 rounded-lg shadow-sm'
                    placeholder='New Note...'
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)} // Update input state
                    onKeyPress={handleKeyPress} // Add onKeyPress event for Enter key
                />
                <button
                    className='rounded-md p-2 bg-[#904107] flex items-center gap-1 w-full sm:w-auto sm:px-4 text-white font-semibold'
                    onClick={handleAddNote}
                >
                    <FaPlusCircle />
                    <span>Add</span>
                </button>
            </div>

            {/* Note List */}
            <div className='px-2'>
                <h2 className='font-bold text-lg border-b-2 border-gray-300 pb-2 mb-2'>Notes</h2>
                <div className='h-[250px] overflow-y-auto'>
                    {notes.length > 0 ? (
                        notes.map((el, index) => (
                            <p key={index} className='py-3 border-b border-gray-300'>
                                {typeof el === "string" ? el : el.task} {/* Handle both string and object with 'task' field */}
                            </p>
                        ))
                    ) : (
                        <p>No notes yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NotesApp;
