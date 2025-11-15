import React, {useState} from 'react';
import Materials from './Materials';
import PPE from './PPE';
import Leave from './Leave';
import Cancel from './Cancel';
import Profile from './Profile';

export default function Dashboard({user, onLogout}){
  const [view,setView]=useState('materials');
  return (
    <div className='container'>
      <div className='header'>
        <div>
          <h2>Klaah Al Malada Trad & Cont. - KMT</h2>
          <div>Logged in: {user.name} ({user.role})</div>
        </div>
        <div>
          <button className='button' onClick={onLogout}>Logout</button>
        </div>
      </div>

      <div style={{display:'flex', gap:8, marginBottom:12}}>
        <button className='button' onClick={()=>setView('materials')}>Materials</button>
        <button className='button' onClick={()=>setView('ppe')}>PPE</button>
        <button className='button' onClick={()=>setView('leave')}>Leave</button>
        <button className='button' onClick={()=>setView('cancel')}>Cancel</button>
        <button className='button' onClick={()=>setView('profile')}>Profile</button>
      </div>

      {view==='materials' && <Materials user={user} />}
      {view==='ppe' && <PPE user={user} />}
      {view==='leave' && <Leave user={user} />}
      {view==='cancel' && <Cancel user={user} />}
      {view==='profile' && <Profile user={user} />}
    </div>
  );
}
