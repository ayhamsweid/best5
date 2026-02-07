import React, { useEffect, useState } from 'react';
import { fetchUsers, updateUser } from '../services/api';

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    fetchUsers().then(setUsers).catch(() => setUsers([]));
  }, []);

  const toggleActive = async (user: any) => {
    const updated = await updateUser(user.id, { is_active: !user.is_active });
    setUsers((prev) => prev.map((u) => (u.id === user.id ? updated : u)));
  };

  return (
    <div>
      <h1 className="text-2xl font-black mb-6">Users</h1>
      <div className="space-y-3">
        {users.map((user) => (
          <div key={user.id} className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between">
            <div>
              <div className="font-semibold">{user.full_name}</div>
              <div className="text-xs text-gray-300">{user.email} · {user.role}</div>
            </div>
            <button
              onClick={() => toggleActive(user)}
              className="text-xs px-3 py-1 rounded-full border border-white/20"
            >
              {user.is_active ? 'Deactivate' : 'Activate'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UsersPage;
