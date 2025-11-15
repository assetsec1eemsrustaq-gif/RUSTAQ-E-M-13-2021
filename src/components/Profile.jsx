import React from 'react';

export default function Profile({user}){
  return (
    <div>
      <h3>Profile</h3>
      <div><strong>Name:</strong> {user.name}</div>
      <div><strong>Username:</strong> {user.username}</div>
      <div><strong>Role:</strong> {user.role}</div>
      <div style={{marginTop:12}}>Sign out using Logout button on top-right.</div>
    </div>
  );
}
