
import { useEffect, useState } from "react";
import { subscribeLogs } from "../services/logService";

export default function LogsPage() {
  const [logs,setLogs]=useState([]);

  useEffect(()=>{
    const unsub=subscribeLogs(setLogs);
    return ()=>unsub();
  },[]);

  return (
    <div>
      <h2>Лог</h2>
      {logs.map(log=>(
        <div key={log.id} style={{padding:"8px",borderBottom:"1px solid #555"}}>
          <strong>{log.user}</strong> — {log.action}
        </div>
      ))}
    </div>
  );
}
