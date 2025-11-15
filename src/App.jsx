import React, {useState} from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

export default function App(){
  const [user, setUser] = useState(()=> {
    const u = localStorage.getItem('kmt_user');
    return u? JSON.parse(u) : null;
  });

  return (
    <div>
      {user ? <Dashboard user={user} onLogout={()=>{ localStorage.removeItem('kmt_user'); setUser(null); }} /> : <Login onLogin={(u)=>{ localStorage.setItem('kmt_user', JSON.stringify(u)); setUser(u); }} />}
    </div>
  );
}
