import { useEffect, useState } from "react";
import NoteForm from "../components/Notes/NoteForm";
import NoteCard from "../components/Notes/NoteCard";
import { subscribeNotes, createNote, removeNote } from "../services/notesService";
import { addLog } from "../services/logService";

export default function NotesPage({ user }) {
 const [notes,setNotes]=useState([]);
 const [showForm,setShowForm]=useState(false);
 const [search,setSearch]=useState("");

 useEffect(()=>{ const u=subscribeNotes(setNotes); return ()=>u();},[]);

 const filtered=[...notes].filter(n=>(n.title||"").toLowerCase().includes(search.toLowerCase())||(n.text||"").toLowerCase().includes(search.toLowerCase())).sort((a,b)=>Number(b.important)-Number(a.important));

 return <div>
 <input placeholder="Поиск заметок" value={search} onChange={e=>setSearch(e.target.value)}/>
 <button
  onClick={()=>setShowForm(!showForm)}
  style={{
    display:"block",
    marginTop:"10px"
  }}
>
  Оставить заметку на доске
</button>
 {showForm && <NoteForm user={user} onCancel={()=>setShowForm(false)} onCreate={async(note)=>{
 await createNote(note);
 await addLog(user,`Создал заметку: ${note.title}${note.important?' (важная)':''}`);
 setShowForm(false);
 }}/>}
 <div style={{display:"flex",flexWrap:"wrap",gap:"12px",marginTop:"20px"}}>
 {filtered.map(note=><NoteCard key={note.id} note={note} user={user} onDelete={removeNote}/>)}
 </div></div>
}