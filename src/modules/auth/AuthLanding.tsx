import { useState } from "react";
import { useAuth } from "./AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/images/Tasket.png";

/**
 * Tailwind v4.1 only (no config). Matches the CodePen behavior:
 * - When Sign In is active: left form visible; right side = red panel with "Sign up" button.
 * - When Sign Up is active: right form visible; left side = red panel with "Sign in" button.
 */
export default function AuthLanding() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const location = useLocation() as {
    state?: { from?: { pathname?: string } };
  };
  const redirectTo = location.state?.from?.pathname || "/";

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      if (isSignUp) {
        await signup(email, pw, name);
      } else {
        await login(email, pw);
      }
      navigate(redirectTo, { replace: true });
    } catch (error) {
      const msg =
        error instanceof Error ? error.message : "Authentication failed";
      setErr(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-800 via-white to-slate-600 flex items-center justify-center p-4">
      <div className="relative w-full max-w-5xl h-[620px]">
        {/* Card shell */}
        <div className="absolute inset-0 bg-white border border-zinc-200 rounded-3xl shadow-[0_10px_20px_rgba(0,0,0,0.08),0_6px_6px_rgba(0,0,0,0.06)] overflow-hidden">
          {/* Forms (base layer) */}
          <div className="absolute inset-0 grid grid-cols-2 z-0">
            {/* Left: Sign In */}
            <div
              className={`flex flex-col items-center justify-center p-10 transition-all duration-500 ${
                isSignUp
                  ? "opacity-0 -translate-x-5 pointer-events-none"
                  : "opacity-100 translate-x-0 pointer-events-auto"
              }`}
            >
              <img src={logo} alt="Logo" className="w-40 h-40 mb-4" />
              <h2 className="text-3xl font-bold mb-6">Sign in</h2>
              <form
                onSubmit={handleSubmit}
                className="w-full max-w-sm space-y-4"
              >
                <Field
                  icon="@"
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={setEmail}
                  autoComplete="email"
                />
                <Field
                  icon="•"
                  type={showPw ? "text" : "password"}
                  placeholder="Password"
                  value={pw}
                  onChange={setPw}
                  autoComplete="current-password"
                  trailing={
                    <button
                      type="button"
                      onClick={() => setShowPw((s) => !s)}
                      className="text-xs font-medium text-blue-800 hover:underline px-2 py-1"
                    >
                      {showPw ? "Hide" : "Show"}
                    </button>
                  }
                />
                {err && <p className="text-sm text-rose-600">{err}</p>}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center rounded-xl bg-blue-800 hover:bg-blue-900 text-white font-semibold py-3 disabled:opacity-60"
                >
                  {loading ? "Please wait…" : "Sign in"}
                </button>
                <p className="text-xs text-zinc-500 text-center">
                  By continuing you agree to our Terms and Privacy Policy.
                </p>
              </form>
            </div>

            {/* Right: Sign Up */}
            <div
              className={`flex flex-col items-center justify-center p-10 transition-all duration-500 ${
                isSignUp
                  ? "opacity-100 translate-x-0 pointer-events-auto"
                  : "opacity-0 translate-x-5 pointer-events-none"
              }`}
            >
              <img src={logo} alt="Logo" className="w-40 h-40 mb-4" />
              <h2 className="text-3xl font-bold mb-6">Create account</h2>
              <form
                onSubmit={handleSubmit}
                className="w-full max-w-sm space-y-4"
              >
                <Field
                  icon="👤"
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={setName}
                  autoComplete="name"
                />
                <Field
                  icon="@"
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={setEmail}
                  autoComplete="email"
                />
                <Field
                  icon="•"
                  type={showPw ? "text" : "password"}
                  placeholder="Password"
                  value={pw}
                  onChange={setPw}
                  autoComplete="new-password"
                  trailing={
                    <button
                      type="button"
                      onClick={() => setShowPw((s) => !s)}
                      className="text-xs font-medium text-blue-800 hover:underline px-2 py-1"
                    >
                      {showPw ? "Hide" : "Show"}
                    </button>
                  }
                />
                {err && <p className="text-sm text-rose-600">{err}</p>}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center rounded-xl bg-blue-800 hover:bg-blue-900 text-white font-semibold py-3 disabled:opacity-60"
                >
                  {loading ? "Please wait…" : "Create account"}
                </button>
                <p className="text-xs text-zinc-500 text-center">
                  By continuing you agree to our Terms and Privacy Policy.
                </p>
              </form>
            </div>
          </div>

          {/* OVERLAY (red panel) — sits ABOVE forms and flips sides */}
          <div className="absolute inset-0 z-10 pointer-events-none">
            {/* Red sheet that covers the INACTIVE side */}
            <div
              className={[
                "absolute top-0 h-full w-1/2 rounded-3xl",
                "bg-gradient-to-br from-blue-600 to-blue-900",
                "shadow-[0_10px_20px_rgba(0,0,0,0.15),0_6px_6px_rgba(0,0,0,0.10)]",
                "transition-transform duration-500 ease-in-out",
                // Sign In active -> cover RIGHT side; Sign Up active -> cover LEFT side
                isSignUp ? "translate-x-0 left-0" : "translate-x-full left-0",
              ].join(" ")}
            />

            {/* Overlay content (buttons/text) on the red side */}
            {/* When Sign In is active, show right-side panel content; when Sign Up is active, show left-side panel content */}
            {/* Left panel content (shows in Sign Up mode) */}
            <div
              className={`absolute top-0 left-0 h-full w-1/2 flex items-center justify-center ${
                isSignUp ? "opacity-100" : "opacity-0"
              } transition-opacity duration-500`}
            >
              <div className="pointer-events-auto text-center px-10 text-white">
                <h3 className="text-2xl font-semibold mb-2">One of us?</h3>
                <p className="text-white/90 mb-4">
                  Sign in with your existing account.
                </p>
                <button
                  type="button"
                  onClick={() => setIsSignUp(false)}
                  className="inline-flex items-center justify-center rounded-full border-2 border-white text-white font-semibold px-8 py-2 hover:bg-white hover:text-rose-600 transition-colors"
                >
                  Sign in
                </button>
              </div>
            </div>

            {/* Right panel content (shows in Sign In mode) */}
            <div
              className={`absolute top-0 right-0 h-full w-1/2 flex items-center justify-center ${
                isSignUp ? "opacity-0" : "opacity-100"
              } transition-opacity duration-500`}
            >
              <div className="pointer-events-auto text-center px-10 text-white">
                <h3 className="text-2xl font-semibold mb-2">New to Tasket?</h3>
                <p className="text-white/90 mb-4">
                  Create an account to get started.
                </p>
                <button
                  type="button"
                  onClick={() => setIsSignUp(true)}
                  className="inline-flex items-center justify-center rounded-full border-2 border-white text-white font-semibold px-8 py-2 hover:bg-white hover:text-rose-600 transition-colors"
                >
                  Sign up
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Small input component ---------- */
function Field({
  icon,
  type,
  placeholder,
  value,
  onChange,
  autoComplete,
  trailing,
}: {
  icon: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete?: string;
  trailing?: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="flex items-center gap-2 rounded-xl border border-zinc-300 px-3 py-2 focus-within:ring-2 focus-within:ring-rose-500 bg-white">
        <span className="text-zinc-500 text-sm min-w-4 text-center">
          {icon}
        </span>
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          className="w-full outline-none"
        />
        {trailing}
      </div>
    </label>
  );
}
