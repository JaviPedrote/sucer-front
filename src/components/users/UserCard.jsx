import React, { memo } from 'react';
import { IoClose } from 'react-icons/io5';

const UserCard = memo(({ user, askDelete, askEdit }) => (
  <div className="space-y-1 rounded-xl border border-slate-200 p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
    <div className="flex justify-between">
      <span className="font-medium">ID: {user.id}</span>
      <button onClick={() => askEdit(user)} className="rounded bg-blue-600 px-2 py-1 text-xs font-semibold text-white hover:bg-blue-700">Editar</button>
    </div>
    <p><strong>Nombre:</strong> {user.name}</p>
    <p><strong>Email:</strong> {user.email}</p>
    <div className="flex justify-between">
      <p><strong>Rol:</strong> <span className="capitalize">{user.role.slug}</span></p>
      {user.role_id !== 1 && (
        <button onClick={() => askDelete(user.id)} className="rounded bg-red-600 px-2 py-1 text-xs font-semibold text-white hover:bg-red-700">Borrar</button>
      )}
    </div>
  </div>
));

export default UserCard;