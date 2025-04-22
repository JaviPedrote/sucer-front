import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Home() {
  const { logoutUser, user } = useContext(AuthContext);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-3xl font-bold">Home (privada)</h1>
      <p className="text-lg">Usuario: {user.email}</p>
      <button
        onClick={logoutUser}
        className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition"
      >
        Cerrar sesión
      </button>
    </div>
  );
}