import { doc,getDoc,setDoc,updateDoc,deleteDoc,onSnapshot,collection } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { addLog } from "./logService";

export async function craftRecipe(recipe, inventoryItems, user){
 for(const ing of recipe.ingredients){
   const item=inventoryItems.find(i=>i.name===ing.name);
   if(!item || item.quantity < ing.qty) return false;
 }
 const used=[];
 for(const ing of recipe.ingredients){
   const item=inventoryItems.find(i=>i.name===ing.name);
   await updateDoc(doc(db,"inventory",item.id),{ quantity: item.quantity - ing.qty });
   used.push({inventoryId:item.id,name:item.name,qty:ing.qty});
 }
 await setDoc(doc(db,"lastCraft","current"),{recipeName:recipe.name,recipeId:recipe.id,ingredients:used,user});
 await addLog(user,`Изготовил: ${recipe.name} (x${recipe.output})`);
 return true;
}

export async function undoLastCraft(user){
 const ref=doc(db,"lastCraft","current");
 const snap=await getDoc(ref);
 if(!snap.exists()) return false;
 const data=snap.data();
 for(const ing of data.ingredients){
   const itemRef=doc(db,"inventory",ing.inventoryId);
   const itemSnap=await getDoc(itemRef);
   const current=itemSnap.data()?.quantity ?? 0;
   await updateDoc(itemRef,{ quantity: current + ing.qty });
 }
 await addLog(user,`Отменил изготовление: ${data.recipeName}`);
 await deleteDoc(ref);
 return true;
}

export async function saveRecipeRating(recipeId,recipeName,user,rating){
 await setDoc(doc(db,"recipeRatings",`${recipeId}_${user}`),{
  recipeId,user,rating
 });
 await addLog(user,`Поставил ${rating}★ для ${recipeName}`);
}

export function subscribeRecipeRatings(cb){
 return onSnapshot(collection(db,"recipeRatings"),snap=>{
   const rows=snap.docs.map(d=>d.data());
   cb(rows);
 });
}
