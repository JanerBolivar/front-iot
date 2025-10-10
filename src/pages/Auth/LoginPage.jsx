import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Home } from "lucide-react";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/app";

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPwd, setShowPwd] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function onChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(form.email.trim(), form.password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err?.message || "Error al iniciar sesión");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-[80vh] grid place-items-center p-6">
      {/* Botón para volver al inicio */}
      <div className="absolute top-4 left-4">
        <Link
          to="/docs"
          className="inline-flex items-center gap-2 rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <Home className="h-4 w-4" />
          Volver al inicio
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm space-y-4">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Iniciar Sesión</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Accede a tu panel</p>
        </div>

        {error && (
          <div className="rounded-md border border-red-200 dark:border-red-700 bg-red-50 dark:bg-red-900/30 px-3 py-2 text-sm text-red-700 dark:text-red-300">
            {error}
          </div>
        )}

        <div className="space-y-1.5">
          <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">Correo</label>
          <input
            id="email" name="email" type="email" autoComplete="email"
            value={form.email} onChange={onChange}
            className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-700"
            required
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">Contraseña</label>
          <div className="relative">
            <input
              id="password" name="password" type={showPwd ? "text" : "password"}
              autoComplete="current-password"
              value={form.password} onChange={onChange}
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 pr-20 text-sm outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-700"
              required
            />
            <button
              type="button"
              onClick={() => setShowPwd((s) => !s)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            >
              {showPwd ? "Ocultar" : "Mostrar"}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {submitting ? "Ingresando..." : "Entrar"}
        </button>

        <div className="text-center text-xs text-gray-500 dark:text-gray-400">
          ¿No tienes cuenta?{" "}
          <Link className="text-blue-600 dark:text-blue-400 hover:underline" to="/register">Regístrate</Link>
        </div>
      </form>
    </div>
  );
}
