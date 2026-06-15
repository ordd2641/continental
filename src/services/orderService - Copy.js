
import {
 collection, addDoc, onSnapshot, query, orderBy,
 deleteDoc, doc, getDocs
} from "firebase/firestore";
import { db } from "../firebase/firebase";

const ordersRef = collection(db,"ingredientOrders");

export function subscribeOrders(cb){
 return onSnapshot(query(ordersRef, orderBy("createdAt","asc")), snap =>
   cb(snap.docs.map(d=>({id:d.id,...d.data()})))
 );
}

export async function createOrder(items){
  await addDoc(ordersRef,{
    items: items.map(([name, qty]) => ({
      name,
      qty
    })),
    createdAt: Date.now()
  });
}

export async function removeOrder(id){
 await deleteDoc(doc(db,"ingredientOrders",id));
}
