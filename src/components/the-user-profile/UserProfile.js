import React from 'react';

function UserProfile({ user, handleLogout }) {
  return (
    <div>
      <h2>Welcome, {user.username}</h2>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default UserProfile;
