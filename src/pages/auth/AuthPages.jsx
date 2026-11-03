import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";
import AppLogo from "../../components/common/AppLogo";
function Shell({ title, children }) {
  return (
    <main className="grid min-h-screen place-items-center bg-cream p-4">
      <div className="card w-full max-w-md p-6">
        <div className="mb-6 flex justify-center">
          <AppLogo />
        </div>
        <h1 className="text-center text-2xl font-black">{title}</h1>
        {children}
      </div>
    </main>
  );
}
export function LoginPage() {
  const [email, setEmail] = useState(""),
    [password, setPassword] = useState(""),
    [error, setError] = useState(""),
    nav = useNavigate();
  async function submit(e) {
    e.preventDefault();
    if (!isSupabaseConfigured) return setError("Supabase is not configured.");
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) setError("Login failed. Check your email and password.");
    else nav("/account");
  }
  return (
    <Shell title="Sign in">
      <form onSubmit={submit} className="mt-5 space-y-4">
        <label className="label">
          Email
          <input
            className="input mt-1"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label className="label">
          Password
          <input
            className="input mt-1"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        {error && <p className="text-sm text-red-700">{error}</p>}
        <button className="btn-primary w-full">Sign in</button>
        <div className="flex justify-between text-sm">
          <Link to="/register" className="text-brand">
            Create account
          </Link>
          <Link to="/forgot-password" className="text-brand">
            Forgot password?
          </Link>
        </div>
      </form>
    </Shell>
  );
}
export function RegisterPage() {
  const [email, setEmail] = useState(""),
    [password, setPassword] = useState(""),
    [name, setName] = useState(""),
    [message, setMessage] = useState("");
  async function submit(e) {
    e.preventDefault();

    setMessage("");

    if (!supabase) {
      setMessage("Supabase is not configured.");
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: name.trim(),
          },
        },
      });

      console.log("Registration data:", data);
      console.error("Registration error:", error);

      if (error) {
        //    setMessage(`Registration failed: ${error.message}`);
        setMessage(
          `Registration failed: We're unable to send the verification email right now. Please wait a few minutes and try again.`,
        );
        return;
      }

      setMessage(
        "Registration successful. Please check your email to confirm your account.",
      );
    } catch (error) {
      console.error("Registration exception:", error);

      setMessage("Registration failed. Please try again.");
    }
  }
  return (
    <Shell title="Customer registration">
      <form onSubmit={submit} className="mt-5 space-y-4">
        <label className="label">
          Full name
          <input
            className="input mt-1"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label className="label">
          Email
          <input
            className="input mt-1"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label className="label">
          Password
          <input
            className="input mt-1"
            type="password"
            minLength="8"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <button className="btn-primary w-full">Register as customer</button>
        {message && <p className="text-sm">{message}</p>}
      </form>
    </Shell>
  );
}

export function ForgotPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      const redirectUrl = `${window.location.origin}/reset-password`;

      console.log("Password reset redirect URL:", redirectUrl);

      const { error } = await supabase.auth.resetPasswordForEmail(
        email.trim(),
        {
          redirectTo: redirectUrl,
        },
      );

      if (error) {
        console.error("Password reset error:", error);

        setMessage(`Unable to send reset email: ${error.message}`);

        return;
      }

      setMessage(
        "Password reset link sent successfully. Please check your email.",
      );
    } catch (error) {
      console.error("Password reset exception:", error);

      setMessage("Unable to send reset email. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Shell title="Reset password">
      <form onSubmit={submit} className="mt-5 space-y-4">
        <label className="label">
          Email
          <input
            className="input mt-1"
            type="email"
            placeholder="Enter your email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? "Sending reset link..." : "Send reset link"}
        </button>

        {message && <p className="text-sm">{message}</p>}

        <div className="text-center">
          <Link to="/login" className="text-sm text-brand">
            Back to sign in
          </Link>
        </div>
      </form>
    </Shell>
  );
}

export function ResetPage() {
  const [p, setP] = useState(""),
    [m, setM] = useState("");
  async function submit(e) {
    e.preventDefault();
    const { error } = await supabase.auth.updateUser({ password: p });
    setM(
      error
        ? "Password could not be updated."
        : "Password updated. You can now sign in.",
    );
  }
  return (
    <Shell title="Choose a new password">
      <form onSubmit={submit} className="mt-5 space-y-4">
        <input
          className="input"
          type="password"
          minLength="8"
          required
          value={p}
          onChange={(e) => setP(e.target.value)}
        />
        <button className="btn-primary w-full">Update password</button>
        {m && <p className="text-sm">{m}</p>}
      </form>
    </Shell>
  );
}
