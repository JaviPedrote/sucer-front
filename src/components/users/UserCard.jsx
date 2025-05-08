import { memo } from 'react';
import { RiDeleteBin2Fill } from "react-icons/ri";
import { AiFillEdit } from "react-icons/ai";

const UserCard = memo(({ user, askDelete, askEdit }) => (
  <div className="space-y-2 rounded-lg outline outline-slate-300 p-4 shadow-sm dark:outline-slate-600 dark:bg-slate-800 relative mb-8">
    <div className="flex justify-between">
      {/* <span className="font-medium">ID: {user.id}</span> */}
      <button onClick={() => askEdit(user)} className="absolute right-1 top-1 rounded-tr-lg rounded  bg-blue-600 px-1.5 py-0.5 text-xs font-semibold text-white hover:bg-blue-700">
        <AiFillEdit className="h-7 w-5" />
      </button>
    </div>
    <p><strong>Nombre:</strong> {user.name}</p>
    <p><strong>Email:</strong> {user.email}</p>
    <div className="flex justify-between">
      <p><strong>Rol:</strong> <span className="capitalize">{user.role.slug}</span></p>
      {user.role_id !== 1 && (
        <button onClick={() => askDelete(user)} className="absolute right-1 bottom-1 rounded-br-lg rounded bg-red-600 px-1.5 py-0.5 text-xs font-semibold text-white hover:bg-red-700">
          <RiDeleteBin2Fill className="h-7 w-5" />
        </button>
      )}
    </div>
  </div>
));

export default UserCard;