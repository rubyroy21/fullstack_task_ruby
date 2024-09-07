import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import noteIcon from "./utils/icon/noteIcon.svg";
import NotesApp from "./components/NotesApp";

const socket = io("http://localhost:3000");

const App: React.FC = () => {
  const [notes, setNotes] = useState<string[]>([]);

  // Fetch tasks from the server on initial load
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/fetchAllTasks`);
        const data = await response.json();
        setNotes(data.map((task: any) => task.task || task));  // Ensure proper format
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();

    // Listen for new notes from the WebSocket
    socket.on("taskAdded", (newTask: string) => {
      setNotes((prevNotes) => [...prevNotes, newTask]);
    });

    return () => {
      socket.off("taskAdded"); // Cleanup the socket event listener on component unmount
    };
  }, []);

  // Function to add a new note
  const addNote = (newNote: string) => {
    if (newNote.trim()) {
      // Optimistically update the UI
      setNotes((prevNotes) => [...prevNotes, newNote]);
      // Emit the event to the server
      socket.emit("add", newNote);
    }
  };

  console.log(notes.length,);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="p-4 lg:w-1/3 bg-white rounded-xl shadow-lg space-y-4 border border-gray-300">
        {/* Heading */}
        <div className="flex p-5 gap-3 items-center justify-center md:justify-start">
          <img src={noteIcon} alt="noteIcon" style={{ width: "48px", height: "48px" }} />
          <h1 className="font-bold text-2xl md:text-3xl">Note App</h1>
        </div>
        <NotesApp notes={notes} addNote={addNote} />
      </div>
    </div>
  );
};

export default App;
