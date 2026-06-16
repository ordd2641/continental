import { useState } from "react";
import { markRead, updateNote } from "../../services/notesService";
import { addLog } from "../../services/logService";

export default function NoteCard({ note, onDelete, user }) {
 const [edit,setEdit]=useState(false);
 const [title,setTitle]=useState(note.title);
 const [text,setText]=useState(note.text);
 const [important,setImportant]=useState(!!note.important);

 const cardStyle={
   width:"280px",
   padding:"14px",
   background:"#e6d6a8",
   color:"#222",
   borderRadius:"16px",
   border:"1px solid #d7dbe0",
   boxShadow:"0 6px 16px rgba(0,0,0,.12)"
 };

 return <div style={cardStyle}>
 <div style={{textAlign:"center",fontSize:"18px"}}>📌</div>

 {important && (
   <div style={{
     color:"#b54747",
     fontWeight:"700",
     marginBottom:"8px"
   }}>
     ВАЖНО
   </div>
 )}

 {edit ? <>
 <input value={title} onChange={e=>setTitle(e.target.value)} />
 <textarea value={text} onChange={e=>setText(e.target.value)} />
 <label>
  <input
   type="checkbox"
   checked={important}
   onChange={e=>setImportant(e.target.checked)}
  /> Важное
 </label>

 <button onClick={async()=>{
 const oldImp=!!note.important;
 await updateNote(note.id,{title,text,important});
 await addLog(user,"Отредактировал заметку: "+title);

 if(oldImp!==important){
   await addLog(user,(important?"Установил":"Снял")+" важность: "+title);
 }

 setEdit(false);
 }}>
  Сохранить
 </button>
 </> : <>
 <h3>{note.title}</h3>
 <p>{note.text}</p>
 </>}

 <div>Прочитали: {(note.readers||[]).join(", ")}</div>

 <div style={{display:"flex",gap:"6px",marginTop:"6px",flexWrap:"wrap"}}>
 <button onClick={async()=>{
   await markRead(note.id,user);
   await addLog(user,"Прочитал заметку: "+note.title);
 }}>✓</button>

 <button onClick={()=>setEdit(true)}>✎</button>

 <button onClick={async()=>{
   await addLog(user,"Удалил заметку: "+note.title);
   await onDelete(note.id);
 }}>✕</button>
 </div>
 </div>
}
