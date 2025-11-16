import React from 'react';
export default function Header({user, onLogout}){
  return (
    <header className="py-4 border-b mb-4">
      <div className="container flex justify-between items-center">
        <div style={{display:'flex', alignItems:'center', gap:12}}>
          <div style={{width:64, height:64, borderRadius:8, background:'#eee', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700}}>
            LOGO
          </div>
          <div>
            <h1 className="text-2xl font-bold">KMTC - RUSTAQ</h1>
            <div className="text-sm text-gray-600">Klaah Al Malada Trad & Cont.</div>
          </div>
        </div>
        <div>
          {user ? (
            <div className="flex items-center space-x-3">
              <div className="text-sm">Hello, <strong>{user.name}</strong> ({user.role})</div>
              <button className="btn bg-gray-200" onClick={onLogout}>Logout</button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
