import React, { useEffect, useMemo, useState } from 'react';
import { createUser, deleteUser, fetchUsers, resetUserPassword, updateUser } from '../services/api';

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [creating, setCreating] = useState(false);
  const [createValues, setCreateValues] = useState({ full_name: '', email: '', password: '', role: 'CONTENT_WRITER', is_active: true });
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Record<string, any>>({});
  const roles = useMemo(() => ['ADMIN', 'CHIEF_EDITOR', 'EDITOR', 'CONTENT_WRITER'], []);

  useEffect(() => {
    fetchUsers().then(setUsers).catch(() => setUsers([]));
  }, []);

  const onCreate = async () => {
    setError(null);
    if (!createValues.full_name.trim() || !createValues.email.trim() || !createValues.password.trim()) {
      setError('Name, email, and password are required.');
      return;
    }
    setCreating(true);
    try {
      const created = await createUser({
        full_name: createValues.full_name.trim(),
        email: createValues.email.trim(),
        password: createValues.password,
        role: createValues.role,
        is_active: createValues.is_active
      });
      setUsers((prev) => [created, ...prev]);
      setCreateValues({ full_name: '', email: '', password: '', role: 'CONTENT_WRITER', is_active: true });
    } catch (e: any) {
      setError(e?.message || 'Failed to create user');
    } finally {
      setCreating(false);
    }
  };

  const toggleActive = async (user: any) => {
    const updated = await updateUser(user.id, { is_active: !user.is_active });
    setUsers((prev) => prev.map((u) => (u.id === user.id ? updated : u)));
  };

  const startEdit = (user: any) => {
    setEditingId(user.id);
    setEditValues({
      full_name: user.full_name,
      email: user.email,
      role: user.role,
      is_active: user.is_active
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValues({});
  };

  const saveEdit = async (user: any) => {
    const updated = await updateUser(user.id, editValues);
    setUsers((prev) => prev.map((u) => (u.id === user.id ? updated : u)));
    cancelEdit();
  };

  const onResetPassword = async (user: any) => {
    const password = window.prompt(`New password for ${user.email}`);
    if (!password) return;
    await resetUserPassword(user.id, { password });
    alert('Password updated');
  };

  const onDelete = async (user: any) => {
    if (!confirm(`Delete user ${user.email}?`)) return;
    await deleteUser(user.id);
    setUsers((prev) => prev.filter((u) => u.id !== user.id));
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return users.filter((user) => {
      const text = `${user.full_name || ''} ${user.email || ''}`.toLowerCase();
      const matchesQuery = !q || text.includes(q);
      const matchesRole = roleFilter === 'ALL' || user.role === roleFilter;
      return matchesQuery && matchesRole;
    });
  }, [users, query, roleFilter]);

  return (
    <div>
      <h1 className="text-2xl font-black mb-6">Users</h1>
      <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-6">
        <div className="text-sm font-semibold mb-3">Create User</div>
        {error && <div className="text-xs text-red-300 mb-3">{error}</div>}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input
            className="bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm"
            placeholder="Full name"
            value={createValues.full_name}
            onChange={(e) => setCreateValues((prev) => ({ ...prev, full_name: e.target.value }))}
          />
          <input
            className="bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm"
            placeholder="Email"
            value={createValues.email}
            onChange={(e) => setCreateValues((prev) => ({ ...prev, email: e.target.value }))}
          />
          <input
            type="password"
            className="bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm"
            placeholder="Password"
            value={createValues.password}
            onChange={(e) => setCreateValues((prev) => ({ ...prev, password: e.target.value }))}
          />
          <select
            className="bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm"
            value={createValues.role}
            onChange={(e) => setCreateValues((prev) => ({ ...prev, role: e.target.value }))}
          >
            {roles.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          <label className="flex items-center gap-2 text-xs text-gray-300">
            <input
              type="checkbox"
              checked={createValues.is_active}
              onChange={() => setCreateValues((prev) => ({ ...prev, is_active: !prev.is_active }))}
            />
            Active
          </label>
          <button
            onClick={onCreate}
            className="bg-primary text-white px-4 py-2 rounded-lg text-sm disabled:opacity-60"
            disabled={creating}
          >
            {creating ? 'Creating...' : 'Create'}
          </button>
        </div>
      </div>
      <div className="flex flex-wrap gap-3 mb-4">
        <input
          className="bg-white/10 border border-white/10 rounded-lg px-4 py-2 text-sm"
          placeholder="Search by name or email..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select
          className="bg-white/10 border border-white/10 rounded-lg px-4 py-2 text-sm"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="ALL">All roles</option>
          {roles.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-3">
        {filtered.map((user) => (
          <div key={user.id} className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div>
              <div className="font-semibold">{user.full_name}</div>
              <div className="text-xs text-gray-300">{user.email} · {user.role}</div>
            </div>
            {editingId === user.id ? (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                <input
                  className="bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm"
                  placeholder="Full name"
                  value={editValues.full_name || ''}
                  onChange={(e) => setEditValues((prev) => ({ ...prev, full_name: e.target.value }))}
                />
                <input
                  className="bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm"
                  placeholder="Email"
                  value={editValues.email || ''}
                  onChange={(e) => setEditValues((prev) => ({ ...prev, email: e.target.value }))}
                />
                <select
                  className="bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm"
                  value={editValues.role || user.role}
                  onChange={(e) => setEditValues((prev) => ({ ...prev, role: e.target.value }))}
                >
                  {roles.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
                <label className="flex items-center gap-2 text-xs text-gray-300">
                  <input
                    type="checkbox"
                    checked={!!editValues.is_active}
                    onChange={() => setEditValues((prev) => ({ ...prev, is_active: !prev.is_active }))}
                  />
                  Active
                </label>
                <div className="flex items-center gap-2">
                  <button onClick={() => saveEdit(user)} className="text-xs px-3 py-1 rounded-full bg-primary text-white">
                    Save
                  </button>
                  <button onClick={cancelEdit} className="text-xs px-3 py-1 rounded-full border border-white/20">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap items-center gap-2 mt-3">
                <button onClick={() => startEdit(user)} className="text-xs px-3 py-1 rounded-full border border-white/20">
                  Edit
                </button>
                <button onClick={() => toggleActive(user)} className="text-xs px-3 py-1 rounded-full border border-white/20">
                  {user.is_active ? 'Deactivate' : 'Activate'}
                </button>
                <button onClick={() => onResetPassword(user)} className="text-xs px-3 py-1 rounded-full border border-white/20">
                  Reset Password
                </button>
                <button onClick={() => onDelete(user)} className="text-xs px-3 py-1 rounded-full text-red-300 border border-red-400/30">
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default UsersPage;
