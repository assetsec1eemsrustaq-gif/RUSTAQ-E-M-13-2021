import React, {useState} from 'react';
import Header from './components/Header';
import Login from './components/Login';
import Materials from './components/Materials';
import PPE from './components/PPE';
import Leave from './components/Leave';
import Cancel from './components/Cancel';
import Profile from './components/Profile';

export default function App(){
  const [user, setUser] = useState(null);
  const [view, setView] = useState('materials');

  const onLogin = (u) => { setUser(u); };
  const onLogout = () => { setUser(null); setView('materials'); };

  return (
    <div>
      <Header user={user} onLogout={onLogout} />
      {!user ? <Login onLogin={onLogin} /> : (
        <div className="container">
          <nav className="mb-4">
            <button className="btn mr-2" onClick={()=>setView('materials')}>Materials</button>
            <button className="btn mr-2" onClick={()=>setView('ppe')}>PPE</button>
            <button className="btn mr-2" onClick={()=>setView('leave')}>Leave</button>
            <button className="btn mr-2" onClick={()=>setView('cancel')}>Cancel</button>
            <button className="btn mr-2" onClick={()=>setView('profile')}>Profile</button>
          </nav>

          <div>
            {view === 'materials' && <Materials currentUser={user} />}
            {view === 'ppe' && <PPE currentUser={user} />}
            {view === 'leave' && <Leave />}
            {view === 'cancel' && <Cancel />}
            {view === 'profile' && <Profile user={user} />}
          </div>
        </div>
      )}
    </div>
  );
}
