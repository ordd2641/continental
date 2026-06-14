
import { useState } from "react";

export default function NoteForm({ user, onCreate, onCancel }) {
  const [title,setTitle]=useState("");
  const [text,setText]=useState("");
  const [important,setImportant]=useState(false);

  return (
    <div style={{marginTop:"15px"}}>
      <div>Автор: {user}</div>
      <input placeholder="Тема" value={title} onChange={e=>setTitle(e.target.value)} />
      <br/>
      <textarea placeholder="Текст заметки" value={text} onChange={e=>setText(e.target.value)} />
      <br/>
      <label>
        <input type="checkbox" checked={important} onChange={e=>setImportant(e.target.checked)} />
        Важное
      </label>
      <br/>
      <button onClick={()=>onCreate({title,text,author:user,important})}>Прикрепить</button>
      <button onClick={onCancel}>Отмена</button>
    </div>
  );
}
