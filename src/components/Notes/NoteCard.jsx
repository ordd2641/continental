import { useState } from "react";
import { markRead, updateNote } from "../../services/notesService";
import { addLog } from "../../services/logService";

export default function NoteCard({ note, onDelete, user }) {
 const [edit,setEdit]=useState(false);
 const [title,setTitle]=useState(note.title);
 const [text,setText]=useState(note.text);
 const [important,setImportant]=useState(!!note.important);

 return <div style={{width:"280px",padding:"12px",background:"#e7d39c",color:"#000",borderRadius:"8px"}}>
 <div style={{textAlign:"center"}}>📌</div>
 {important && <div>⚠️ ВАЖНО</div>}
 {edit ? <>
 <input value={title} onChange={e=>setTitle(e.target.value)} />
 <textarea value={text} onChange={e=>setText(e.target.value)} />
 <label><input type="checkbox" checked={important} onChange={e=>setImportant(e.target.checked)}/> Важное</label>
 <button onClick={async()=>{
 const oldImp=!!note.important;
 await updateNote(note.id,{title,text,important});
 await addLog(user,"Отредактировал заметку: "+title);
 if(oldImp!==important){
   await addLog(user, (important?"Установил":"Снял")+" важность: "+title);
 }
 setEdit(false);
 }}>Сохранить</button>
 </>:<>
 <h3>{note.title}</h3><p>{note.text}</p></>}
 <div>Прочитали: {(note.readers||[]).join(", ")}</div>
 <button onClick={async()=>{await markRead(note.id,user);await addLog(user,"Прочитал заметку: "+note.title);}}>Прочитал</button>
 <button onClick={()=>setEdit(true)}>Редактировать</button>
 <button onClick={async()=>{await addLog(user,"Удалил заметку: "+note.title);await onDelete(note.id);}}>Удалить</button>
 </div>
}