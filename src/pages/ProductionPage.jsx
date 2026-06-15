import { useEffect,useState } from "react";
import { subscribeInventory } from "../services/inventoryService";
import { craftRecipe,undoLastCraft,saveRecipeRating,subscribeRecipeRatings } from "../services/productionService";
import { foodRecipes, alcoholRecipes } from "../data/recipes";

function RecipeCard({recipe,stockItems,user,ratings}){
 const stock={}; stockItems.forEach(i=>stock[i.name]=i.quantity);
 const values=recipe.ingredients.map(i=>Math.floor((stock[i.name]||0)/i.qty));
 const canMake=values.length?Math.max(0,Math.min(...values)):0;

 const recipeRatings=ratings.filter(r=>r.recipeId===recipe.id);
 const avg=recipeRatings.length?(recipeRatings.reduce((a,b)=>a+b.rating,0)/recipeRatings.length).toFixed(1):"0";

 return <div style={{
   border:"1px solid #666",
   padding:"12px",
   marginBottom:"12px",
   borderRadius:"8px",
   background:canMake>0?"rgba(0,255,0,0.05)":"transparent"
 }}>
 <h3>{recipe.name}</h3>
 <div>Рейтинг: {avg} ★</div>
 <div>{[1,2,3,4,5].map(n=><button key={n} onClick={()=>saveRecipeRating(recipe.id,recipe.name,user,n)}>{n}★</button>)}</div>
 <div>Выход x{recipe.output}</div>

 {recipe.ingredients.map(i=>{
   const have=stock[i.name]||0;
   const ok=have>=i.qty;
   return (
    <div key={i.name} style={{color:ok?"#22aa22":"#cc2222",fontWeight:600}}>
      ({have}) {i.name} x{i.qty}
    </div>
   );
 })}

 <div>Можно создать: {canMake}</div>

 <button disabled={canMake<=0} onClick={()=>craftRecipe(recipe,stockItems,user)}>Изготовить</button>
 <button onClick={()=>undoLastCraft(user)}>↶</button>
 </div>
}

export default function ProductionPage({user}){
 const [items,setItems]=useState([]);
 const [search,setSearch]=useState("");
 const [ratings,setRatings]=useState([]);
 const [onlyAvailable,setOnlyAvailable]=useState(false);

 useEffect(()=>{
  const u1=subscribeInventory(setItems);
  const u2=subscribeRecipeRatings(setRatings);
  return ()=>{u1();u2();};
 },[]);

 const canMakeRecipe=(r)=>{
   const stock={}; items.forEach(i=>stock[i.name]=i.quantity);
   const values=r.ingredients.map(i=>Math.floor((stock[i.name]||0)/i.qty));
   return (values.length?Math.max(0,Math.min(...values)):0)>0;
 };

 const filterRecipe=(r)=>{
   const okSearch=r.name.toLowerCase().includes(search.toLowerCase());
   const okAvailable=!onlyAvailable || canMakeRecipe(r);
   return okSearch && okAvailable;
 };

 return <div>
  <input placeholder="Поиск рецепта" value={search} onChange={e=>setSearch(e.target.value)} />
  <label style={{marginLeft:"10px"}}>
    <input type="checkbox" checked={onlyAvailable} onChange={e=>setOnlyAvailable(e.target.checked)} />
    Только доступные рецепты
  </label>

  <h2>Еда</h2>
  {foodRecipes.filter(filterRecipe).map(r=><RecipeCard key={r.id} recipe={r} stockItems={items} user={user} ratings={ratings}/>)}
  <hr/>
  <h2>Спиртное</h2>
  {alcoholRecipes.filter(filterRecipe).map(r=><RecipeCard key={r.id} recipe={r} stockItems={items} user={user} ratings={ratings}/>)}
 </div>
}