// src/pages/Admin/UsersPage.jsx
import React, { useEffect, useMemo, useReducer } from "react";
import { Link } from "react-router-dom";
import { Users, UserPlus, Search, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

// -------- helpers de almacenamiento local --------
const LS_KEYS = ["gd_users", "app_users", "users"];
function loadFromStorage() {
  for (const k of LS_KEYS) {
    try {
      const raw = localStorage.getItem(k);
      if (raw) return JSON.parse(raw) || [];
    } catch (error) {
      console.warn('Error reading from localStorage:', error);
    }
  }
  return [];
}
function saveToStorage(users) {
  try {
    localStorage.setItem("gd_users", JSON.stringify(users));
  } catch (error) {
    console.warn('Error saving to localStorage:', error);
  }
}
function normUser(u, i = 0) {
  return {
    id: u?.id ?? `${u?.email || "user"}#${i}`,
    name: u?.name ?? "—",
    email: u?.email ?? "—",
    role: (u?.role || "user").toLowerCase(),
    active: u?.active ?? true,
    createdAt: u?.createdAt || new Date().toISOString(),
  };
}
function formatDate(d) {
  try {
    return new Date(d).toLocaleString();
  } catch {
    return d || "—";
  }
}

// -------- reducer de UI/estado --------
const initialState = {
  // datos
  users: [],
  // ui
  query: "",
  sortKey: "createdAt", // name | email | role | active | createdAt
  sortDir: "desc", // asc | desc
  page: 1,
  pageSize: 8,
  selected: new Set(), // ids seleccionados
};

function reducer(state, action) {
  switch (action.type) {
    case "INIT": {
      return { ...state, users: action.payload.map(normUser) };
    }
    case "SET_QUERY": {
      return { ...state, query: action.payload, page: 1 };
    }
    case "SET_SORT": {
      const { key } = action.payload;
      const dir =
        state.sortKey === key ? (state.sortDir === "asc" ? "desc" : "asc") : "asc";
      return { ...state, sortKey: key, sortDir: dir, page: 1 };
    }
    case "SET_PAGE": {
      return { ...state, page: action.payload };
    }
    case "TOGGLE_SELECT": {
      const next = new Set(state.selected);
      next.has(action.payload) ? next.delete(action.payload) : next.add(action.payload);
      return { ...state, selected: next };
    }
    case "CLEAR_SELECTION": {
      return { ...state, selected: new Set() };
    }
    case "SELECT_ALL": {
      // payload: array de ids visibles
      return { ...state, selected: new Set(action.payload) };
    }
    case "DELETE_SELECTED": {
      const remaining = state.users.filter((u) => !state.selected.has(u.id));
      saveToStorage(remaining);
      return { ...state, users: remaining, selected: new Set() };
    }
    case "TOGGLE_ACTIVE": {
      const users = state.users.map((u) =>
        u.id === action.payload ? { ...u, active: !u.active } : u
      );
      saveToStorage(users);
      return { ...state, users };
    }
    case "TOGGLE_ROLE": {
      const users = state.users.map((u) =>
        u.id === action.payload
          ? { ...u, role: u.role === "admin" ? "user" : "admin" }
          : u
      );
      saveToStorage(users);
      return { ...state, users };
    }
    default:
      return state;
  }
}

export default function UsersPage() {
  const { listUsers } = useAuth?.() || {};
  const [state, dispatch] = useReducer(reducer, initialState);

  // cargar desde AuthContext si existe, si no desde localStorage
  useEffect(() => {
    const fromCtx = typeof listUsers === "function" ? listUsers() : null;
    const base = Array.isArray(fromCtx) ? fromCtx : loadFromStorage();
    dispatch({ type: "INIT", payload: base });
  }, [listUsers]);

  // derivados (filtro/orden/paginación)
  const filtered = useMemo(() => {
    const q = state.query.trim().toLowerCase();
    let arr = state.users;
    if (q) {
      arr = arr.filter(
        (user) =>
          (user.name || "").toLowerCase().includes(q) ||
          (user.email || "").toLowerCase().includes(q) ||
          (user.role || "").toLowerCase().includes(q)
      );
    }
    // ordenar
    arr = [...arr].sort((a, b) => {
      const { sortKey, sortDir } = state;
      const va = a[sortKey];
      const vb = b[sortKey];
      if (va == null && vb == null) return 0;
      if (va == null) return sortDir === "asc" ? -1 : 1;
      if (vb == null) return sortDir === "asc" ? 1 : -1;
      // boolean
      if (typeof va === "boolean" && typeof vb === "boolean") {
        return sortDir === "asc" ? Number(va) - Number(vb) : Number(vb) - Number(va);
      }
      // fecha o string/num
      const sa = String(va).toLowerCase();
      const sb = String(vb).toLowerCase();
      if (sa < sb) return sortDir === "asc" ? -1 : 1;
      if (sa > sb) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return arr;
  }, [state]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / state.pageSize));
  const page = Math.min(state.page, totalPages);
  const start = (page - 1) * state.pageSize;
  const end = start + state.pageSize;
  const pageUsers = filtered.slice(start, end);

  const allVisibleIds = pageUsers.map((user) => user.id);
  const allSelectedInPage = allVisibleIds.every((id) => state.selected.has(id));

  // métricas rápidas
  const metrics = useMemo(() => {
    const admins = state.users.filter((user) => user.role === "admin").length;
    const last = state.users.length ? state.users[state.users.length - 1].createdAt : null;
    return {
      total: state.users.length,
      admins,
      lastText: last ? formatDate(last) : "—",
    };
  }, [state.users]);

  // UI handlers
  const toggleSort = (key) => dispatch({ type: "SET_SORT", payload: { key } });
  const toggleSelectAllInPage = () =>
    dispatch({
      type: allSelectedInPage ? "CLEAR_SELECTION" : "SELECT_ALL",
      payload: allVisibleIds,
    });

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Usuarios</h1>
        <div className="flex items-center gap-2">
          {state.selected.size > 0 && (
            <button
              onClick={() => dispatch({ type: "DELETE_SELECTED" })}
              className="inline-flex items-center gap-2 rounded-md bg-rose-600 px-3 py-2 text-sm text-white hover:bg-rose-700"
            >
              <Trash2 className="h-4 w-4" /> Eliminar seleccionados
            </button>
          )}
          <Link
            to="/register"
            className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700"
          >
            <UserPlus className="h-4 w-4" /> Crear usuario
          </Link>
        </div>
      </div>

      {/* métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
          <p className="text-xs text-gray-500 dark:text-gray-400">Total</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-gray-100">{metrics.total}</p>
        </div>
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
          <p className="text-xs text-gray-500 dark:text-gray-400">Admins</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-gray-100">{metrics.admins}</p>
        </div>
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
          <p className="text-xs text-gray-500 dark:text-gray-400">Último registro</p>
          <p className="mt-1 text-lg font-medium text-gray-900 dark:text-gray-100">{metrics.lastText}</p>
        </div>
      </div>

      {/* buscador */}
      <div className="mb-3 flex items-center gap-2">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Buscar por nombre, correo o rol"
            className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 pl-8 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-700"
            value={state.query}
            onChange={(e) => dispatch({ type: "SET_QUERY", payload: e.target.value })}
          />
        </div>
      </div>

      {/* tabla / vacío */}
      {pageUsers.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-8 text-center">
          <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-full bg-gray-100 dark:bg-gray-700">
            <Users className="h-6 w-6 text-gray-500 dark:text-gray-400" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">No hay usuarios para mostrar</h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Crea el primero para comenzar a asignar permisos.
          </p>
          <Link
            to="/register"
            className="mt-4 inline-flex items-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700"
          >
            <UserPlus className="h-4 w-4" /> Crear usuario
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
              <tr>
                <th className="px-4 py-2">
                  <input
                    type="checkbox"
                    checked={allSelectedInPage}
                    onChange={toggleSelectAllInPage}
                  />
                </th>
                <th className="px-4 py-2 text-left cursor-pointer" onClick={() => toggleSort("name")}>
                  Nombre {state.sortKey === "name" ? (state.sortDir === "asc" ? "▲" : "▼") : ""}
                </th>
                <th className="px-4 py-2 text-left cursor-pointer" onClick={() => toggleSort("email")}>
                  Correo {state.sortKey === "email" ? (state.sortDir === "asc" ? "▲" : "▼") : ""}
                </th>
                <th className="px-4 py-2 cursor-pointer" onClick={() => toggleSort("role")}>
                  Rol {state.sortKey === "role" ? (state.sortDir === "asc" ? "▲" : "▼") : ""}
                </th>
                <th className="px-4 py-2 cursor-pointer" onClick={() => toggleSort("active")}>
                  Estado {state.sortKey === "active" ? (state.sortDir === "asc" ? "▲" : "▼") : ""}
                </th>
                <th className="px-4 py-2 cursor-pointer" onClick={() => toggleSort("createdAt")}>
                  Creado {state.sortKey === "createdAt" ? (state.sortDir === "asc" ? "▲" : "▼") : ""}
                </th>
                <th className="px-4 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pageUsers.map((user) => (
                <tr key={user.id} className="border-t border-gray-200 dark:border-gray-600">
                  <td className="px-4 py-2">
                    <input
                      type="checkbox"
                      checked={state.selected.has(user.id)}
                      onChange={() => dispatch({ type: "TOGGLE_SELECT", payload: user.id })}
                      className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 dark:focus:ring-blue-600"
                    />
                  </td>
                  <td className="px-4 py-2 text-gray-900 dark:text-gray-100">{user.name}</td>
                  <td className="px-4 py-2 text-gray-900 dark:text-gray-100">{user.email}</td>
                  <td className="px-4 py-2 text-center">
                    <span
                      onClick={() => dispatch({ type: "TOGGLE_ROLE", payload: user.id })}
                      className={`inline-flex cursor-pointer rounded-full px-2 py-0.5 text-xs ${
                        user.role === "admin"
                          ? "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                      }`}
                      title="Cambiar rol"
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() => dispatch({ type: "TOGGLE_ACTIVE", payload: user.id })}
                      className={`rounded-full px-2 py-0.5 text-xs ${
                        user.active ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300" : "bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300"
                      }`}
                    >
                      {user.active ? "Activo" : "Inactivo"}
                    </button>
                  </td>
                  <td className="px-4 py-2 text-center text-gray-900 dark:text-gray-100">{formatDate(user.createdAt)}</td>
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() =>
                        dispatch({ type: "SELECT_ALL", payload: [user.id] }) ||
                        dispatch({ type: "DELETE_SELECTED" })
                      }
                      className="rounded-md border border-gray-300 dark:border-gray-600 px-2 py-1 hover:bg-rose-50 dark:hover:bg-rose-900/30 text-gray-700 dark:text-gray-300"
                    >
                      <Trash2 className="h-4 w-4 text-rose-600 dark:text-rose-400" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* paginación */}
          <div className="flex items-center justify-between p-3 border-t border-gray-200 dark:border-gray-600">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Mostrando {start + 1}–{Math.min(end, total)} de {total}
            </p>
            <div className="flex items-center gap-1">
              <button
                disabled={page === 1}
                onClick={() => dispatch({ type: "SET_PAGE", payload: page - 1 })}
                className="rounded-md border border-gray-300 dark:border-gray-600 p-1 disabled:opacity-40 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="px-2 text-sm text-gray-700 dark:text-gray-300">
                {page} / {totalPages}
              </span>
              <button
                disabled={page === totalPages}
                onClick={() => dispatch({ type: "SET_PAGE", payload: page + 1 })}
                className="rounded-md border border-gray-300 dark:border-gray-600 p-1 disabled:opacity-40 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
