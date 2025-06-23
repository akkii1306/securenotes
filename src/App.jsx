import { useState,useEffect } from "react";
import Editor from "./components/Editor";
import NoteList from "./components/NoteList";
import NoteView from "./pages/NoteView";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const App = ()=>{
  const[notes,setNotes]=useState(()=>
  JSON.parse(localStorage.getItem("notes"))|| []);
  const [selcted,setSelected]=
  useState(null);
  const saveNote=(cipher)=>{
    const updated=[...notes,cipher];
    setNotes(updated);
    localStorage.setItem("notes",JSON.stringify(updated));
  };
return(
  <div className="max-w-3xl mx-auto p-4">
    <h1 className="text-3xl font-bold mb-4 text-purple-700">SecureNotes</h1>
    <Editor onSave={saveNote}/>
    <NoteList notes={notes} onSelect={setSelected}/>
    {selcted && <NoteView cipher={selcted}/>}
    <ToastContainer/>
  </div>
);
};
export default App;