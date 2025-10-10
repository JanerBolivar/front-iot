import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu } from "lucide-react";
import Sidebar from "@/components/common/Sidebar/Sidebar";
import UserMenu from "@/components/features/auth/UserMenu";
import ThemeSwitcher from "@/components/common/ThemeSwitcher";

export default function MainLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar (off-canvas en móvil) */}
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} className="shrink-0" />

      {/* Columna derecha */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* TOPBAR */}
        <header className="h-14 border-b bg-white dark:bg-gray-800 dark:border-gray-700 flex items-center justify-between px-4 sticky top-0 z-20">
          {/* botón hamburguesa solo en móvil */}
          <button
            className="md:hidden inline-flex items-center gap-2 rounded-md border border-gray-300 dark:border-gray-600 px-2 py-1.5 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
            onClick={() => setMobileOpen(true)}
            aria-label="Abrir menú"
          >
            <Menu className="h-5 w-5" />
            <span className="text-sm">Menú</span>
          </button>

          <div className="flex-1" />

          {/* Theme switcher y menú de usuario */}
          <div className="flex items-center gap-3">
            <ThemeSwitcher />
            <UserMenu />
          </div>
        </header>

        {/* Contenido */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
