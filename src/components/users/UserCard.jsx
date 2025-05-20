import { memo } from 'react';
import { RiDeleteBin2Fill } from "react-icons/ri";
import { AiFillEdit } from "react-icons/ai";

export const UserCard = memo(({ user, askEdit, askDelete }) => {
  // IDs con privilegios para los que no mostramos botones
  const protectedIds = [1,46, 36, 37];
  const canEdit = !protectedIds.includes(user.id);
  const canDelete = !protectedIds.includes(user.id);

  return (
    <article className="relative mb-8 overflow-hidden rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
      {/* Header: nombre y acciones */}
      <header className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center space-x-2 place-content-between">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            {user.name}
          </h2>
        </div>
      </header>

      {/* Body: datos del usuario */}
      <div className="space-y-3">
        <p className="text-gray-700 dark:text-gray-300">
          <span className="font-semibold">Email:</span> {user.email}
        </p>
        <p className="text-gray-700 dark:text-gray-300">
          <span className="font-semibold">Rol:</span> <span className="capitalize">{user.role.slug}</span>
        </p>
         <div>
            <div className="mt-2 flex space-x-2 sm:mt-0 place-content-end">
              {canEdit && (
                <button
                  onClick={() => askEdit(user)}
                  aria-label="Editar usuario"
                  className="flex items-center rounded bg-blue-600 px-3 py-1 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <span className="ml-1">Editar</span>
                </button>
              )}
              {canDelete && (
                <button
                  onClick={() => askDelete(user)}
                  aria-label="Eliminar usuario"
                  className="flex items-center rounded bg-red-600 px-3 py-1 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <span className="ml-1">Eliminar</span>
                </button>
              )}
            </div>
          </div>
      </div>
    </article>
  );
});

export default UserCard;
