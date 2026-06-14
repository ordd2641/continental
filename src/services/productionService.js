
import { doc,getDoc,updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { addLog } from "./logService";

export async function craftRecipe(recipe, inventoryItems, user){
 for(const ing of recipe.ingredients){
   const item=inventoryItems.find(i=>i.name===ing.name);
   if(!item || item.quantity < ing.qty) return false;
 }
 for(const ing of recipe.ingredients){
   const item=inventoryItems.find(i=>i.name===ing.name);
   await updateDoc(doc(db,"inventory",item.id),{
     quantity: item.quantity - ing.qty
   });
 }
 await addLog(user,`Изготовил: ${recipe.name} (x${recipe.output})`);
 return true;
}
