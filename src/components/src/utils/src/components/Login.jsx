import React, {useState} from 'react';
import { loadData, saveData } from '../utils/storage';

export default function Login({onLogin}){
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [showForgot, setShowForgot] = useState(false);
  const [resetUser, setResetUser] = useState('');
  const [newPass, setNewPass] = useState('');

  const tryLogin = (e) => {
    e.preventDefault();
    const data = loadData();
    const u = data.users.find(x => x.username === username && x.password === password);
    if(u){
      onLogin({ name: u.name, role: u.role, username: u.username });
    } else {
      setMessage('Invalid credentials. For staff use username KMTC and password KMTC123. Supervisors/Admins credentials are not shown on login page.');
    }
  };

  const doReset = (e) => {
    e.preventDefault();
    const data = loadData();
    const idx = data.users.findIndex(x=>x.username === resetUser);
    if(idx === -1){ setMessage('User not found'); return; }
    data.users[idx].password = newPass;
    saveData(data);
    setMessage('Password reset. You can now login with new password.');
    setShowForgot(false);
    setResetUser('');
    setNewPass('');
  };

  return (
    <div className="container mt-8">
      <h2 className="text-xl font-semibold mb-4">Sign In - KMTC</h2>
      <p className="mb-2">Only staff credentials are shown here. Use:</p>
      <div className="mb-4 p-3 border rounded">
        <div><strong>USERNAME:</strong> KMTC</div>
        <div><strong>PASSWORD:</strong> KMTC123</div>
      </div>

      <form onSubmit={tryLogin} className="max-w-md">
        <label className="block mb-2">Username
          <input className="w-full p-2 border" value={username} onChange={e=>setUsername(e.target.value)} />
        </label>
        <label className="block mb-2">Password
          <input type="password" className="w-full p-2 border" value={password} onChange={e=>setPassword(e.target.value)} />
        </label>

        <div className="flex items-center justify-between">
          <button className="btn bg-blue-500 text-white" type="submit">Login</button>
          <button type="button" className="btn" onClick={()=>setShowForgot(true)}>Forgot password?</button>
        </div>
      </form>

      {message && <div className="mt-4 text-red-600">{message}</div>}

      {showForgot && (
        <div className="mt-4 p-4 border">
          <h3 className="font-bold">Reset Password</h3>
          <form onSubmit={doReset}>
            <input placeholder="Username to reset" value={resetUser} onChange={e=>setResetUser(e.target.value)} className="p-2 border w-full mb-2" />
            <input placeholder="New password" value={newPass} onChange={e=>setNewPass(e.target.value)} className="p-2 border w-full mb-2" />
            <div className="flex gap-2">
              <button className="btn bg-green-500 text-white" type="submit">Reset</button>
              <button className="btn" type="button" onClick={()=>setShowForgot(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
