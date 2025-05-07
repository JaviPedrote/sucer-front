import React, { memo } from 'react';

const ButtonAddUser = memo(({ newUser }) => (
  <button onClick={newUser} className="flex items-center justify-center rounded-full bg-blue-600 w-8 h-8 text-white shadow-lg hover:bg-blue-700">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 4v16m8-8H4" />
    </svg>
    <span className="sr-only">Agregar usuario</span>
  </button>
));

export default ButtonAddUser;