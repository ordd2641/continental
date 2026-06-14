import { useState } from "react";

import Login from "./pages/Login";
import NotesPage from "./pages/NotesPage";
import InventoryPage from "./pages/InventoryPage";
import ProductionPage from "./pages/ProductionPage";
import OrdersPage from "./pages/OrdersPage";
import LogsPage from "./pages/LogsPage";

export default function App() {
  const [user, setUser] = useState(
    localStorage.getItem("continentalUser")
  );

  const [tab, setTab] = useState("notes");

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  return (
    <div className="app">
      <header className="topbar">

        <div className="logo">
          Континенталь
        </div>

        <div className="tabs">

          <button
            className={tab === "notes" ? "active" : ""}
            onClick={() => setTab("notes")}
          >
            Заметки
          </button>

          <button
            className={tab === "inventory" ? "active" : ""}
            onClick={() => setTab("inventory")}
          >
            Склад
          </button>

          <button
            className={tab === "production" ? "active" : ""}
            onClick={() => setTab("production")}
          >
            Производство
          </button>

          <button
            className={tab === "orders" ? "active" : ""}
            onClick={() => setTab("orders")}
          >
            Заказы
          </button>

          <button
            className={tab === "logs" ? "active" : ""}
            onClick={() => setTab("logs")}
          >
            Лог
          </button>

        </div>

        <div className="user-panel">
          {user}

          <button
            className="logout-btn"
            onClick={() => {
              localStorage.removeItem(
                "continentalUser"
              );
              location.reload();
            }}
          >
            Выход
          </button>
        </div>

      </header>

      <main className="page">

        {tab === "notes" && (
          <NotesPage user={user} />
        )}

        {tab === "inventory" && (
          <InventoryPage user={user} />
        )}

        {tab === "production" && (
          <ProductionPage user={user} />
        )}

        {tab === "orders" && (
          <OrdersPage user={user} />
        )}

        {tab === "logs" && (
          <LogsPage user={user} />
        )}

      </main>
    </div>
  );
}