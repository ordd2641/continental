
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  limit,
  onSnapshot
} from "firebase/firestore";
import { db } from "../firebase/firebase";

const logsRef = collection(db, "logs");

export async function addLog(user, action) {
  await addDoc(logsRef, {
    user,
    action,
    createdAt: serverTimestamp()
  });
}

export function subscribeLogs(cb) {
  return onSnapshot(
    query(logsRef, orderBy("createdAt", "desc"), limit(50)),
    (snap) => cb(snap.docs.map(d => ({ id: d.id, ...d.data() })))
  );
}
