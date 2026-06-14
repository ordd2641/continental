
import {
 collection,onSnapshot,doc,updateDoc,getDoc
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import { addLog } from "./logService";

const ref = collection(db,"inventory");

export const subscribeInventory=(cb)=>
 onSnapshot(ref,s=>cb(s.docs.map(d=>({id:d.id,...d.data()}))));

export async function changeQty(id,value,user){
 const before = await getDoc(doc(db,"inventory",id));
 const oldQty = before.data()?.quantity ?? 0;
 const newQty = Math.max(0, oldQty + value);

 await updateDoc(doc(db,"inventory",id),{ quantity:newQty });
 await addLog(user,`Изменил склад: ${before.data()?.name} ${oldQty} → ${newQty}`);
}

export async function setQty(id,newQty,user){
 const before = await getDoc(doc(db,"inventory",id));
 const oldQty = before.data()?.quantity ?? 0;
 const qty = Math.max(0, Number(newQty)||0);

 await updateDoc(doc(db,"inventory",id),{ quantity:qty });
 await addLog(user,`Изменил склад: ${before.data()?.name} ${oldQty} → ${qty}`);
}
