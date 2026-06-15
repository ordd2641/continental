import { useEffect, useState } from "react";
import { subscribeInventory, changeQty } from "../services/inventoryService";
import { subscribeOrders, createOrder, removeOrder } from "../services/orderService";

export default function OrdersPage() {
  const [inventory,setInventory]=useState([]);
  const [cart,setCart]=useState({});
  const [custom,setCustom]=useState({});
  const [orders,setOrders]=useState([]);

  useEffect(()=>subscribeInventory(setInventory),[]);
  useEffect(()=>subscribeOrders(setOrders),[]);

  const addItem=(name,qty)=>{
    qty=Number(qty||0);
    if(qty<=0) return;
    setCart(p=>({...p,[name]:(p[name]||0)+qty}));
  };

  const createNewOrder=async()=>{
    const items=Object.entries(cart);
    if(!items.length) return;
    await createOrder(items,"Arthur");
    setCart({});
  };

  const markDelivered=async(order)=>{
    for(const itemOrder of order.items){
      const item=inventory.find(i=>i.name===itemOrder.name);
      if(item){
        await changeQty(item.id,itemOrder.qty,"Заказ поставки");
      }
    }
    await removeOrder(order.id);
  };

  const copyOrder=(order)=>{
    const text = order.items.map(i => `${i.name} x${i.qty}`).join("\n");
    navigator.clipboard.writeText(text);
  };

  return (
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"16px"}}>
      <div>
        <h3>Склад</h3>
        {inventory.map(i=>(
          <div key={i.id}>
            {i.name} ({i.quantity})
            <div>
              <button onClick={()=>addItem(i.name,10)}>10</button>
              <button onClick={()=>addItem(i.name,50)}>50</button>
              <button onClick={()=>addItem(i.name,100)}>100</button>
              <input
                style={{width:"60px"}}
                value={custom[i.name]||""}
                onChange={e=>setCustom(p=>({...p,[i.name]:e.target.value}))}
              />
              <button onClick={()=>addItem(i.name,custom[i.name])}>Добавить</button>
            </div>
          </div>
        ))}
      </div>

      <div>
        <h3>Формирование заказа <button onClick={()=>setCart({})}>Очистить все</button></h3>

        {Object.entries(cart).map(([name,qty])=>(
          <div key={name}>
            <input
              value={qty}
              onChange={e=>setCart(p=>({...p,[name]:Number(e.target.value)||0}))}
              style={{width:"70px"}}
            />
            {" "}{name}
            <button onClick={()=>{
              const c={...cart};
              delete c[name];
              setCart(c);
            }}>✕</button>
          </div>
        ))}

        <div style={{position:"sticky",bottom:0,marginTop:"10px"}}>
          <button onClick={createNewOrder}>Заказать</button>
        </div>
      </div>

      <div>
        <h3>Ожидают доставки</h3>

        {orders.map(order=>(
          <div key={order.id} style={{border:"1px solid #666",padding:"8px",marginBottom:"8px"}}>
            <b>Заказ #{order.orderNumber || "?"}</b>

            {order.items?.map(i=>(
              <div key={i.name}>{i.name} x{i.qty}</div>
            ))}

            <button onClick={()=>copyOrder(order)}>Скопировать</button>
            <button onClick={()=>markDelivered(order)}>Доставлено</button>
            <button onClick={async()=>{
              if(window.confirm(`Удалить заказ #${order.orderNumber || "?"}?`)){
                await removeOrder(
  order.id,
  order.orderNumber,
  "Arthur"
);
              }
            }}>✕</button>
          </div>
        ))}
      </div>
    </div>
  );
}
