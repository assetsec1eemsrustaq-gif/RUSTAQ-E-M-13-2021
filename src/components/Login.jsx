import React, {useState} from 'react';

const defaultUsers = [
  {username:'admin', password:'admin123', role:'Admin', name:'Admin User'},
  {username:'super', password:'super123', role:'Supervisor', name:'Supervisor User'},
  {username:'staff', password:'staff123', role:'Staff', name:'Staff User'}
];

export default function Login({onLogin}){
  const [username,setUsername]=useState('');
  const [password,setPassword]=useState('');

  const handle = (e)=>{
    e.preventDefault();
    const u = defaultUsers.find(us=>us.username===username && us.password===password);
    if(u) onLogin(u);
    else alert('Invalid credentials. Try admin/admin123 or super/super123 or staff/staff123');
  };

  return (
    <div className='container'>
      <h1>KMT - Login</h1>
      <form onSubmit={handle}>
        <div className='form-row'>
          <input className='input' placeholder='username' value={username} onChange={e=>setUsername(e.target.value)} />
          <input className='input' type='password' placeholder='password' value={password} onChange={e=>setPassword(e.target.value)} />
          <button className='button' type='submit'>Login</button>
        </div>
      </form>
      <div className='notice'>
        Demo users: admin/admin123 (Admin), super/super123 (Supervisor), staff/staff123 (Staff)
      </div>
    </div>
  );
}
