import {
 collection, addDoc, onSnapshot, query, orderBy,
 deleteDoc, doc, getDocs
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import { addLog } from "./logService";

const ordersRef = collection(db,"ingredientOrders");

export function subscribeOrders(cb){
 return onSnapshot(query(ordersRef, orderBy("createdAt","asc")), snap =>
   cb(snap.docs.map(d=>({id:d.id,...d.data()})))
 );
}

export async function createOrder(items, user="Arthur"){
 const snapshot = await getDocs(ordersRef);
 const orderNumber = snapshot.size + 1;

 await addDoc(ordersRef,{
   orderNumber,
   createdBy:user,
   items: items.map(([name, qty]) => ({ name, qty })),
   createdAt: Date.now()
 });

 await addLog(user, `Создал заказ #${orderNumber}`);
}

export async function removeOrder(id, orderNumber, user="Arthur"){
  await addLog(user, `Удалил заказ #${orderNumber}`);
  await deleteDoc(doc(db,"ingredientOrders",id));
}
