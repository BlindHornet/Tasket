import { useAuth } from "../auth/AuthContext";

export default function Dashboard() {
  const { user, logout } = useAuth();
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p>Welcome {user?.name}</p>
      <button
        onClick={logout}
        className="mt-4 px-4 py-2 bg-brand-500 text-white rounded"
      >
        Log out
      </button>
    </div>
  );
}
