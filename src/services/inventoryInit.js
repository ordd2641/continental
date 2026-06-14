
import { ingredients } from "../data/ingredients";
import { createIngredient } from "./inventoryService";

export async function initInventory(){
 for(const item of ingredients){
   await createIngredient({
     ...item,
     quantity:0
   });
 }
}
