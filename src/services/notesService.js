
import {
 collection, addDoc, onSnapshot, deleteDoc, doc, updateDoc, arrayUnion, serverTimestamp
} from "firebase/firestore";
import { db } from "../firebase/firebase";

const notesRef = collection(db,"notes");

export const subscribeNotes=(cb)=>onSnapshot(notesRef,s=>{
 cb(s.docs.map(d=>({id:d.id,...d.data()})));
});

export const createNote=async(note)=>addDoc(notesRef,{
 ...note,
 readers:[],
 createdAt:serverTimestamp()
});

export const removeNote=(id)=>deleteDoc(doc(db,"notes",id));

export const markRead=(id,user)=>updateDoc(doc(db,"notes",id),{
 readers: arrayUnion(user)
});

export const updateNote=(id,data)=>updateDoc(doc(db,"notes",id),data);
