import { useEffect,useState } from "react";
import { subscribeInventory } from "../services/inventoryService";
import { craftRecipe,undoLastCraft,saveRecipeRating,subscribeRecipeRatings } from "../services/productionService";
import { foodRecipes, alcoholRecipes } from "../data/recipes";

function RecipeCard({recipe,stockItems,user,ratings}){
 const stock={};
 stockItems.forEach(i=>stock[i.name]=i.quantity);

 const values=recipe.ingredients.map(i=>Math.floor((stock[i.name]||0)/i.qty));
 const canMake=values.length?Math.max(0,Math.min(...values)):0;

 const recipeRating=ratings.find(r=>r.recipeId===recipe.id);
 const rating=recipeRating?.rating || 0;

 return (
  <div
    style={{
      border:"1px solid #3f4854",
      padding:"12px",
      borderRadius:"14px",
      background:"#2b3138",
      color:"#e7eaee"
    }}
  >
   <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}><h3>{recipe.name}</h3><div style={{display:"flex",gap:"2px"}}>{[1,2,3,4,5].map(n=><span key={n} onClick={()=>saveRecipeRating(recipe.id,recipe.name,user,n)} style={{cursor:"pointer",fontSize:"11px",color:n<=rating?"#f5c451":"#555"}}>★</span>)}</div></div>

   <div>Выход x{recipe.output}</div>

   {recipe.ingredients.map(i=>{
     const have=stock[i.name]||0;
     const ok=have>=i.qty;

     return (
      <div
        key={i.name}
        style={{
          color:ok?"#22aa22":"#cc2222",
          fontWeight:600
        }}
      >
        ({have}) {i.name} x{i.qty}
      </div>
     );
   })}

   <div>Можно создать: {canMake}</div><div style={{height:"10px"}} />

   <button
     style={{
       minWidth:"110px",
       borderRadius:"12px",
       border:"1px solid #4c5868",
       background:"#39424d",
       color:"#e7eaee"
     }}
     disabled={canMake<=0}
     onClick={()=>craftRecipe(recipe,stockItems,user)}
   >
     Изготовить
   </button>

   <button
     style={{
       width:"34px",
       height:"28px",
       borderRadius:"50%",
       border:"1px solid #4c5868",
       background:"#39424d",
       color:"#e7eaee"
     }}
     onClick={()=>undoLastCraft(user)}
   >
     ↶
   </button>
  </div>
 );
}

export default function ProductionPage({user}){
 const [items,setItems]=useState([]);
 const [search,setSearch]=useState("");
 const [ratings,setRatings]=useState([]);
 const [onlyAvailable,setOnlyAvailable]=useState(false);

 useEffect(()=>{
  const u1=subscribeInventory(setItems);
  const u2=subscribeRecipeRatings(setRatings);

  return ()=>{
   u1();
   u2();
  };
 },[]);

 const canMakeRecipe=(r)=>{
   const stock={};
   items.forEach(i=>stock[i.name]=i.quantity);

   const values=r.ingredients.map(i=>
     Math.floor((stock[i.name]||0)/i.qty)
   );

   return (values.length?Math.max(0,Math.min(...values)):0)>0;
 };

 const filterRecipe=(r)=>
   r.name.toLowerCase().includes(search.toLowerCase()) &&
   (!onlyAvailable || canMakeRecipe(r));

 const food=[...foodRecipes]
  .sort((a,b)=>a.name.localeCompare(b.name,"ru"))
  .filter(filterRecipe);

 const alc=[...alcoholRecipes]
  .sort((a,b)=>a.name.localeCompare(b.name,"ru"))
  .filter(filterRecipe);

 return (
  <div>
   <input
     placeholder="Поиск рецепта"
     value={search}
     onChange={e=>setSearch(e.target.value)}
   />

   <label style={{marginLeft:"10px"}}>
     <input
       type="checkbox"
       checked={onlyAvailable}
       onChange={e=>setOnlyAvailable(e.target.checked)}
     />
     {" "}Только доступные рецепты
   </label>

   <h2>Еда</h2><div style={{height:"12px"}} />

   <div
     style={{
       display:"grid",
       gridTemplateColumns:"repeat(6,minmax(210px,240px))",
       gap:"12px"
     }}
   >
     {food.map(r=>
       <RecipeCard
         key={r.id}
         recipe={r}
         stockItems={items}
         user={user}
         ratings={ratings}
       />
     )}
   </div>

   <div style={{height:"12px"}} /><hr/><div style={{height:"12px"}} />

   <h2>Спиртное</h2><div style={{height:"12px"}} />

   <div
     style={{
       display:"grid",
       gridTemplateColumns:"repeat(6,minmax(210px,240px))",
       gap:"12px"
     }}
   >
     {alc.map(r=>
       <RecipeCard
         key={r.id}
         recipe={r}
         stockItems={items}
         user={user}
         ratings={ratings}
       />
     )}
   </div>
  </div>
 );
}