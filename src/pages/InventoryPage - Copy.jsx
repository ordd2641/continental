import { useEffect,useState } from "react";
import { subscribeInventory,changeQty,setQty } from "../services/inventoryService";
import { ingredients } from "../data/ingredients";

export default function InventoryPage({user}){
 const [items,setItems]=useState([]);
 const [search,setSearch]=useState("");
 const [drafts,setDrafts]=useState({});

 useEffect(()=>{
  const unsub=subscribeInventory((data)=>{
   setItems(data);
   setDrafts(prev=>{
     const next={...prev};
     data.forEach(item=>{
       if(document.activeElement?.dataset?.itemid !== item.id){
         next[item.id]=item.quantity ?? 0;
       }
     });
     return next;
   });
  });
  return ()=>unsub();
 },[]);

 const perishableMap=Object.fromEntries(ingredients.map(i=>[i.name,i.perishable]));

 const filtered=[...items]
 .sort((a,b)=>(a.name||"").localeCompare(b.name||"","ru"))
 .filter(i=>(i.name||"").toLowerCase().includes(search.toLowerCase()));

 return (
  <div>
   <h2 style={{letterSpacing:"1px"}}>СКЛАД</h2><div style={{height:"12px"}} />

   <input
    placeholder="Поиск"
    value={search}
    onChange={e=>setSearch(e.target.value)}
   />

   <div
    style={{
     display:"grid",
     gridTemplateColumns:"repeat(6,minmax(210px,240px))",
     gap:"12px",
     marginTop:"12px"
    }}
   >
   {filtered.map(item=>(
    <div
      key={item.id}
      style={{
        border:"1px solid #3f4854",
        borderRadius:"14px",
        background:"#2b3138",
        color:"#e7eaee",
        padding:"10px"
      }}
    >
      <div style={{fontWeight:"bold"}}>
        {item.name}
      </div>
      <div style={{fontSize:"11px",opacity:.75,marginTop:"2px"}}>{perishableMap[item.name] ? "Портится" : "Не портится"}</div>

      <div
        style={{
          display:"flex",
          gap:"10px",
          alignItems:"center",
          marginTop:"8px"
        }}
      >
      <button
        style={{
          width:"34px",
          height:"28px",
          borderRadius:"10px",
          border:"1px solid #4c5868",
          background:"#39424d",
          color:"#e7eaee"
        }}
        onClick={()=>changeQty(item.id,-1,user)}
      >
        -
      </button>

      <input
        data-itemid={item.id}
        style={{
          width:"80px",
          textAlign:"center",
          borderRadius:"10px",
          border:"1px solid #4c5868",
          background:"#39424d",
          color:"#e7eaee"
        }}
        value={drafts[item.id] ?? ""}
        onChange={(e)=>setDrafts(prev=>({...prev,[item.id]: e.target.value}))}
        onBlur={()=>setQty(item.id,drafts[item.id],user)}
      />

      <button
        style={{
          width:"34px",
          height:"28px",
          borderRadius:"10px",
          border:"1px solid #4c5868",
          background:"#39424d",
          color:"#e7eaee"
        }}
        onClick={()=>changeQty(item.id,1,user)}
      >
        +
      </button>

      </div>
    </div>
   ))}
   </div>
  </div>
 );
}