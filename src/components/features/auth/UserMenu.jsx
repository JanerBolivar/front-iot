import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronDown, LogOut, User as UserIcon, FileText, Users, Wifi } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function UserMenu() {
  const { user, isAdmin, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  // Si algún día usas este menú en páginas públicas:
  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link
          to="/docs"
          className="hidden sm:inline-block border border-gray-300 rounded-md px-3 py-2 text-sm hover:bg-gray-50"
        >
          Docs públicas
        </Link>
        <Link
          to="/login"
          className="border border-gray-300 rounded-md px-3 py-2 text-sm hover:bg-gray-50"
        >
          Iniciar sesión
        </Link>
        <Link
          to="/register"
          className="bg-blue-600 text-white rounded-md px-3 py-2 text-sm hover:bg-blue-700"
        >
          Registrarse
        </Link>
      </div>
    );
  }

  const initials = (user?.name || user?.email || "U").slice(0, 2).toUpperCase();

  const handleLogout = () => {
    setOpen(false);
    logout();
    navigate("/docs", { replace: true });
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full border px-2 py-1.5 hover:bg-gray-50"
        aria-label="Abrir menú de usuario"
      >
        <div className="h-8 w-8 rounded-full bg-blue-600 text-white grid place-items-center text-sm font-semibold">
          {initials}
        </div>
        <ChevronDown className="h-4 w-4 text-gray-500" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white/95 backdrop-blur-sm shadow-2xl ring-1 ring-black/5 border border-gray-200 z-50">
          <div className="absolute -top-2 right-6 h-3 w-3 rotate-45 bg-white border-l border-t border-gray-200"></div>

          <div className="px-4 pt-3 pb-2">
            <p className="text-sm font-semibold text-gray-900">{user?.first_name || 'Usuario'} {user?.last_name || 'Desconocido'}</p>
            {user?.email && <p className="text-xs text-gray-500">{user.email}</p>}
          </div>
          <div className="h-px bg-gray-200" />

          <Link
            to="/docs"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-gray-50"
          >
            <FileText className="h-4 w-4" />
            Docs públicas
          </Link>

          <Link
            to="/app/profile"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-gray-50"
          >
            <UserIcon className="h-4 w-4" />
            Mi perfil
          </Link>

          {isAdmin && (
            <>
              <Link
                to="/app/admin/users"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-gray-50"
              >
                <Users className="h-4 w-4" />
                Admin (usuarios)
              </Link>
              <Link
                to="/app/admin/diagnostic"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-gray-50"
              >
                <Wifi className="h-4 w-4" />
                Diagnóstico API
              </Link>
            </>
          )}

          <button
            onClick={handleLogout}
            className="w-full text-left flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-gray-50 text-rose-700"
          >
            <LogOut className="h-4 w-4" />
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}
