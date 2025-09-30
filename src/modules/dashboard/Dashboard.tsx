// src/pages/Dashboard.tsx
import { useEffect, useMemo, useState } from "react";
import { collection, getDocs, limit, query, where } from "firebase/firestore";
import { db } from "../../lib/firebase"; // your initialized Firestore
import { useAuth } from "../auth/AuthContext"; // must expose { user, logout }
import logo from "../../assets/images/Tasket.png";

export default function Dashboard() {
  const { user, logout } = useAuth();

  // Initial display: cached -> displayName -> email prefix -> "there"
  const initialDisplay = useMemo(() => {
    const cached = localStorage.getItem("userName");
    const emailPrefix = user?.email ? user.email.split("@")[0] : "";
    return cached || user?.displayName || emailPrefix || "there";
  }, [user?.displayName, user?.email]);

  const [display, setDisplay] = useState(initialDisplay);
  const [loadingName, setLoadingName] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.email) return;

    const run = async () => {
      setError(null);
      setLoadingName(true);
      try {
        // Emails should be stored lowercased in Firestore (`users` docs)
        const emailLc = user.email.toLowerCase();

        const usersRef = collection(db, "users");
        const q = query(usersRef, where("email", "==", emailLc), limit(1));
        const snap = await getDocs(q);

        let nextName = user.displayName || user.email.split("@")[0] || "there";
        if (!snap.empty) {
          const data = snap.docs[0].data() as { name?: string };
          if (data?.name && data.name.trim()) nextName = data.name.trim();
        }

        setDisplay(nextName);
        localStorage.setItem("userName", nextName);
      } catch (e: any) {
        // keep existing fallback UI; show a soft error
        setError(e?.message || "Could not fetch name from users.");
      } finally {
        setLoadingName(false);
      }
    };

    run();
  }, [user?.email, user?.displayName]);

  return (
    <div className="bg-slate-900 text-slate-50 p-6">
      <img
        src={logo}
        alt="Tasket Logo"
        className="absolute top-1 left-1 w-24 h-24 md:w-32 md:h-32"
      />
      <div className="flex items-center justify-between">
        <h1 className="pl-35 text-2xl font-bold">Dashboard</h1>
        <div className="flex flex-col items-end">
          <p className="py-2 text-lg">Welcome {loadingName ? "…" : display}</p>
          <button
            onClick={logout}
            className="px-4 py-2 rounded bg-blue-800 text-white hover:opacity-90"
          >
            Log out
          </button>
        </div>
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      {/* Your dashboard content below */}
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {/* Example cards */}
        <div className="rounded-xl border border-zinc-200 p-4">
          Recipe Manager
        </div>
        <div className="rounded-xl border border-zinc-200 p-4">Card B</div>
      </div>
    </div>
  );
}
