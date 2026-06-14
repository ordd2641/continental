import { useEffect,useState } from "react";
import { subscribeInventory } from "../services/inventoryService";
import { craftRecipe } from "../services/productionService";
import { foodRecipes, alcoholRecipes } from "../data/recipes";

function RecipeCard({recipe,stockItems,user}){
  const stock={};
  stockItems.forEach(i=>stock[i.name]=i.quantity);

  const values=recipe.ingredients.map(i=>{
    const have=stock[i.name]||0;
    return Math.floor(have/i.qty);
  });

  const canMake=values.length?Math.max(0,Math.min(...values)):0;

  const handleCraft=async()=>{
    const ok=await craftRecipe(recipe,stockItems,user);
    if(!ok){
      alert("Недостаточно ингредиентов");
    }
  };

  return (
    <div style={{border:"1px solid #666",padding:"12px",marginBottom:"12px",borderRadius:"8px"}}>
      <h3>{recipe.name}</h3>
      <div>Выход x{recipe.output}</div>

      {recipe.ingredients.map(i=>{
        const have=stock[i.name]||0;
        return (
          <div key={i.name} style={{color:have>=i.qty?"#4caf50":"#ff6b6b"}}>
            ({have}) {i.name} x{i.qty}
          </div>
        );
      })}

      <div>Можно создать: {canMake}</div>

      <button disabled={canMake<=0} onClick={handleCraft}>
        Изготовить
      </button>
    </div>
  );
}

export default function ProductionPage({user}){
 const [items,setItems]=useState([]);
 const [search,setSearch]=useState("");

 useEffect(()=>{
  const unsub=subscribeInventory(setItems);
  return ()=>unsub();
 },[]);

 const filterRecipe=(r)=>r.name.toLowerCase().includes(search.toLowerCase());

 return (
  <div>
   <input placeholder="Поиск рецепта" value={search} onChange={e=>setSearch(e.target.value)} />
   <h2>Еда</h2>
   {foodRecipes.filter(filterRecipe).map(r=><RecipeCard key={r.id} recipe={r} stockItems={items} user={user} />)}
   <hr />
   <h2>Спиртное</h2>
   {alcoholRecipes.filter(filterRecipe).map(r=><RecipeCard key={r.id} recipe={r} stockItems={items} user={user} />)}
  </div>
 );
}