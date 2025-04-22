import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  return (
    <div className="flex items-center justify-center min-h-screen flex-col gap-2">
      <h1 className="text-3xl font-bold">Dashboard (privada)</h1>
      <p>Email en store: {user.email}</p>
    </div>
  );
}