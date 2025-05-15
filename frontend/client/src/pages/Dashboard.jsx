import React from 'react';
import Logout from './Logout';
import AdminPanel from './AdminPanel';

function Dashboard() {
    const role = localStorage.getItem("role");
    if(role == "admin"){
        return (<AdminPanel/>)
    }
  return (
    <div>
      <h1>This is some kind of dashboard</h1>
      <Logout/>
    </div>
  );
}

export default Dashboard;
