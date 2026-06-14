import { useEffect,useState } from "react";
import { subscribeInventory,changeQty,setQty } from "../services/inventoryService";

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

 const filtered=items.filter(i=>
   (i.name||"").toLowerCase().includes(search.toLowerCase())
 );

 return (
  <div>
   <h2>Склад</h2>

   <input
    placeholder="Поиск"
    value={search}
    onChange={e=>setSearch(e.target.value)}
   />

   {filtered.map(item=>(
    <div
      key={item.id}
      style={{
        display:"flex",
        gap:"10px",
        margin:"6px 0",
        alignItems:"center"
      }}
    >
      <div style={{width:"260px"}}>
        {item.name}
      </div>

      <button onClick={()=>changeQty(item.id,-1,user)}>-</button>

      <input
        data-itemid={item.id}
        style={{width:"70px",textAlign:"center"}}
        value={drafts[item.id] ?? ""}
        onChange={(e)=>{
          setDrafts(prev=>({
            ...prev,
            [item.id]: e.target.value
          }));
        }}
        onBlur={()=>{
          setQty(item.id,drafts[item.id],user);
        }}
      />

      <button onClick={()=>changeQty(item.id,1,user)}>+</button>

      <div>
        {item.perishable ? "Портится" : "Не портится"}
      </div>
    </div>
   ))}
  </div>
 );
}