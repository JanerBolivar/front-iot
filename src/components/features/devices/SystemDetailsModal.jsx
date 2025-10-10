// src/components/DevicesSection/SystemDetailsModal.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  X, MapPin, Wifi, Clock, PlusCircle,
  Droplets, Activity, Settings, Calendar, ChevronLeft, ChevronRight,
  Lock, Unlock // ⬅️ NEW
} from "lucide-react";
import TankViz from "@/components/features/devices/TankViz";
import RealisticValve from "@/components/features/devices/RealisticValve";

const HIST_KEY = "gd_history";
const MAX_ROWS = 500;
const PAGE_SIZE = 10; // tamaño de página

/** Carga historial para un sistema */
function loadHistoryFor(systemId) {
  try {
    const map = JSON.parse(localStorage.getItem(HIST_KEY) ?? "{}");
    const arr = Array.isArray(map[systemId]) ? map[systemId] : [];
    return arr.map((r) => ({ ...r, ts: new Date(r.ts) })); // ISO -> Date
  } catch {
    return [];
  }
}

/** Guarda historial para un sistema */
function saveHistoryFor(systemId, rows) {
  try {
    const map = JSON.parse(localStorage.getItem(HIST_KEY) ?? "{}");
    map[systemId] = rows.map((r) => ({
      ...r,
      ts: r.ts instanceof Date ? r.ts.toISOString() : r.ts, // Date -> ISO
    }));
    localStorage.setItem(HIST_KEY, JSON.stringify(map));
  } catch (error) {
    console.warn('Error saving history to localStorage:', error);
  }
}

// Icono por módulo
const iconFor = (key) => (key === "nivel" ? Droplets : key === "sensor" ? Activity : Settings);

// helpers de fecha/paginación
const pad2 = (n) => String(n).padStart(2, "0");
const dateKey = (d) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`; // yyyy-mm-dd

function getPageNumbers(total, current) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = [1];
  if (current > 3) pages.push("…");
  const middle = [current - 1, current, current + 1].filter(
    (p) => p > 1 && p < total
  );
  pages.push(...middle);
  if (current < total - 2) pages.push("…");
  pages.push(total);
  return pages;
}

export default function SystemDetailsModal({ open, onClose, system }) {
  const [rows, setRows] = useState([]);

  // Nivel actual (para el tanque animado) - con validación
  const currentLevel = Math.round(rows.at(-1)?.nivel ?? 60);

  // Tendencia y estado de válvula - con validación
  const last = rows.at(-1) || {};
  // const prev = rows.at(-2) || null; // No se usa actualmente
  const valveOpen = String(last.valvula || "").toLowerCase() === "abierta";
  // const trend = prev
  //   ? last.nivel > prev.nivel
  //     ? "up"
  //     : last.nivel < prev.nivel
  //     ? "down"
  //     : "steady"
  //   : "steady"; // No se usa actualmente

  // Semilla
  const seedRows = useMemo(() => {
    const out = [];
    const now = Date.now();
    for (let i = 0; i < 30; i++) {
      out.push({
        ts: new Date(now - i * 60 * 60 * 1000), // cada hora
        nivel: Math.max(0, Math.min(100, 50 + Math.round(Math.sin(i / 3) * 15) + (i % 7))),
        sensor: Math.max(0, Math.round(35 + Math.cos(i / 2) * 3 + (i % 5) * 0.3)), // cm
        valvula: i % 2 === 0 ? "Abierta" : "Cerrada",
        // signal: Math.max(50, 90 - (i % 9) * 2), // Eliminado según solicitud
        note: "—",
      });
    }
    return out.reverse();
  }, []);

  // fecha seleccionada y página
  const [selectedDate, setSelectedDate] = useState(null);
  const [page, setPage] = useState(1);
  const [tankVariant, setTankVariant] = useState("rect");
  const [isFilling, setIsFilling] = useState(false);
  const [fillingInterval, setFillingInterval] = useState(null);

  // Cargar historial
  useEffect(() => {
    if (!open || !system?.id) return;
    const persisted = loadHistoryFor(system.id);
    const initial = persisted.length ? persisted : seedRows;
    setRows(initial);
    const lastDate = initial.at(-1)?.ts || new Date();
    setSelectedDate(new Date(lastDate));
    setPage(1);
  }, [open, system?.id, seedRows]);

  // Guardar
  useEffect(() => {
    if (!open || !system?.id) return;
    saveHistoryFor(system.id, rows);
  }, [open, system?.id, rows]);

  // Filtro por día
  const filteredRows = useMemo(() => {
    if (!selectedDate) return rows;
    const key = dateKey(selectedDate);
    return rows.filter((r) => dateKey(r.ts) === key);
  }, [rows, selectedDate]);

  // Paginación
  const totalPages = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE));
  useEffect(() => setPage(1), [selectedDate, rows]);
  const pageRows = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredRows.slice(start, start + PAGE_SIZE);
  }, [filteredRows, page]);

  // Limpiar interval al cerrar el modal
  useEffect(() => {
    return () => {
      if (fillingInterval) {
        clearInterval(fillingInterval);
      }
    };
  }, [fillingInterval]);

  if (!open || !system) return null;

  const statusOk = (system.controller?.status || "offline") === "online";
  const statusChip = statusOk ? "bg-green-100 text-green-700" : "bg-rose-100 text-rose-700";

  // Simular registro (igual que antes)
  const addFakeRow = () => {
    setRows((prev) => {
      const next = [
        ...prev,
        {
          ts: new Date(),
          nivel: Math.max(0, Math.min(100, (prev.at(-1)?.nivel ?? 60) + (Math.random() * 6 - 3))),
          sensor: Math.max(0, (prev.at(-1)?.sensor ?? 35) + (Math.random() * 1.5 - 0.7)),
          valvula: Math.random() > 0.5 ? "Abierta" : "Cerrada",
          // signal: Math.max(40, Math.min(100, (prev.at(-1)?.signal ?? 80) + (Math.random() * 10 - 5))), // Eliminado según solicitud
          note: "—",
        },
      ];
      if (next.length > MAX_ROWS) next.splice(0, next.length - MAX_ROWS);
      return next;
    });
  };


  // ⬅️ MEJORADO: Abrir/Cerrar válvula con efecto de llenado progresivo
  const toggleValve = () => {
    const last = rows.at(-1) || {};
    const wasOpen = String(last.valvula || "").toLowerCase() === "abierta";
    const willOpen = !wasOpen;

    // Si se abre la válvula, iniciar llenado progresivo
    if (willOpen && !wasOpen) {
      setIsFilling(true);
      const interval = setInterval(() => {
        setRows((prev) => {
          const current = prev.at(-1) || {};
          const currentLevel = Number(current.nivel ?? 60);
          
          // Solo llenar si no está al 100%
          if (currentLevel >= 100) {
            setIsFilling(false);
            clearInterval(interval);
            return prev;
          }

          const delta = 2 + Math.random() * 2; // 2-4% cada 2 segundos
          const nextLevel = Math.max(0, Math.min(100, currentLevel + delta));

          const next = [
            ...prev,
            {
              ts: new Date(),
              nivel: nextLevel,
              sensor: Math.max(0, (current.sensor ?? 35) + (Math.random() * 1.2 - 0.6)),
              valvula: "Abierta",
              // signal: Math.max(40, Math.min(100, (current.signal ?? 80) + (Math.random() * 6 - 3))), // Eliminado según solicitud
              note: "Llenando...",
            },
          ];
          
          if (next.length > MAX_ROWS) next.splice(0, next.length - MAX_ROWS);
          return next;
        });
      }, 2000); // Cada 2 segundos
      
      setFillingInterval(interval);
    } else {
      // Si se cierra la válvula, detener el llenado
      if (fillingInterval) {
        clearInterval(fillingInterval);
        setFillingInterval(null);
      }
      setIsFilling(false);
    }

    // Actualizar estado inmediatamente
    setRows((prev) => {
      const last = prev.at(-1) || {};
      const prevLevel = Number(last.nivel ?? 60);
      
      const next = [
        ...prev,
        {
          ts: new Date(),
          nivel: prevLevel,
          sensor: Math.max(0, (last.sensor ?? 35) + (Math.random() * 1.2 - 0.6)),
          valvula: willOpen ? "Abierta" : "Cerrada",
          // signal: Math.max(40, Math.min(100, (last.signal ?? 80) + (Math.random() * 6 - 3))), // Eliminado según solicitud
          note: willOpen ? "Iniciando llenado..." : "Válvula cerrada",
        },
      ];
      if (next.length > MAX_ROWS) next.splice(0, next.length - MAX_ROWS);

      // Mostrar el nuevo registro (hoy) y resetear a página 1
      const now = new Date();
      setSelectedDate((d) => (!d || dateKey(d) !== dateKey(now) ? now : d));
      setPage(1);

      return next;
    });
  };

  return (
    <div
      className="fixed inset-0 z-[60] grid place-items-center bg-black/40 p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div className="w-full max-w-6xl overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-xl">
        <div className="grid max-h-[85vh] grid-rows-[auto_1fr_auto]">
          {/* Header */}
          <div className="flex items-center justify-between border-b p-4">
            <div className="min-w-0">
              <h3 className="truncate text-lg font-semibold">
                Detalles de {system.name || "Sistema"}
              </h3>
              <p className="text-xs text-gray-500">{system.location}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`rounded-full px-2 py-0.5 text-xs ${statusChip}`}>
                {statusOk ? "En línea" : "Fuera de línea"}
              </span>
              <button
                aria-label="Cerrar"
                onClick={onClose}
                className="rounded-md p-2 text-gray-600 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="overflow-y-auto p-4">
            {/* Resumen del sistema */}
            <div className="mb-6">
              <div className="grid gap-4 md:grid-cols-3">
                {/* Información del sistema */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
                  <h4 className="mb-3 text-sm font-semibold text-gray-700 flex items-center">
                    <MapPin className="h-4 w-4 text-blue-600 mr-2" />
                    Información del Sistema
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ubicación:</span>
                      <span className="font-medium">{system.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Estado:</span>
                      <span className={`font-medium ${statusOk ? 'text-green-600' : 'text-red-600'}`}>
                        {statusOk ? 'En línea' : 'Fuera de línea'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">ID:</span>
                      <span className="font-mono text-xs">{system.id}</span>
                    </div>
                  </div>
                </div>

                {/* Módulos del sistema */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                  <h4 className="mb-3 text-sm font-semibold text-gray-700 flex items-center">
                    <Activity className="h-4 w-4 text-green-600 mr-2" />
                    Módulos Activos
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {(system.modules || []).map((m, idx) => {
                      const Icon = iconFor(m.key);
                      const chip =
                        m.status === "online"
                          ? "bg-green-100 text-green-700"
                          : "bg-rose-100 text-rose-700";
                      return (
                        <div
                          key={`${m.key}-${idx}`}
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs ${chip}`}
                          title={`${m.name}`}
                        >
                          <Icon className="h-3 w-3" />
                          <span className="font-medium">{m.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Estado actual */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
                  <h4 className="mb-3 text-sm font-semibold text-gray-700 flex items-center">
                    <Clock className="h-4 w-4 text-purple-600 mr-2" />
                    Estado Actual
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Nivel:</span>
                      <span className="font-bold text-blue-600">{currentLevel}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Litros:</span>
                      <span className="font-bold text-blue-600">{(currentLevel * 5).toFixed(0)}L</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Válvula:</span>
                      <span className={`font-medium ${valveOpen ? 'text-green-600' : 'text-red-600'}`}>
                        {valveOpen ? 'Abierta' : 'Cerrada'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Actualizado:</span>
                      <span className="text-xs">
                        {system.controller?.lastSeen
                          ? new Date(system.controller.lastSeen).toLocaleTimeString()
                          : "—"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Dispositivos del sistema */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Settings className="w-5 h-5 text-gray-600 mr-2" />
                Dispositivos del Sistema
              </h4>
              
              {/* Grid de dispositivos */}
              <div className="grid gap-6 lg:grid-cols-3">
                {/* Tanque */}
                <div className="lg:col-span-2">
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-xl p-6 border border-blue-200 dark:border-blue-700">
                    <h5 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center">
                      <Droplets className="w-5 h-5 text-blue-600 mr-2" />
                      Tanque de Agua (500L)
                    </h5>
                    <TankViz
                      level={currentLevel}
                      capacityLiters={500}
                      variant={tankVariant}
                      indicator="chip"
                      valveOpen={false}
                      valveSpin={false}
                      showHeader={false}
                      showPercent={true}
                      className="mx-auto"
                    />
                    
                    {/* Selector de variantes del tanque */}
                    <div className="bg-white/70 dark:bg-gray-700/70 rounded-lg p-4 mt-4">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 block">
                        Variante del tanque:
                      </label>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setTankVariant("rect")}
                          className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                            tankVariant === "rect"
                              ? 'bg-blue-500 text-white shadow-md'
                              : 'bg-white text-gray-700 hover:bg-blue-50 border border-gray-300'
                          }`}
                        >
                          Rectangular
                        </button>
                        <button
                          onClick={() => setTankVariant("square")}
                          className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                            tankVariant === "square"
                              ? 'bg-blue-500 text-white shadow-md'
                              : 'bg-white text-gray-700 hover:bg-blue-50 border border-gray-300'
                          }`}
                        >
                          Cuadrado
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sensor y Válvula */}
                <div className="space-y-6">
                  {/* Sensor */}
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                    <h5 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                      <Activity className="w-4 h-4 text-green-600 mr-2" />
                      Sensor HC-SR04
                    </h5>
                    <div className="text-center space-y-3">
                      <div className="bg-white/70 rounded-lg p-4">
                        <div className="text-2xl font-bold text-green-600">
                          {Math.max(0, (last.sensor ?? 35)).toFixed(1)} cm
                        </div>
                        <div className="text-xs text-gray-600 mt-1">Distancia al agua</div>
                        <div className="text-xs text-gray-500 mt-2 bg-gray-100 rounded px-2 py-1">
                          Nivel: {currentLevel}% • {(currentLevel * 5).toFixed(0)}L
                        </div>
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${statusOk ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
                        <span className="text-xs text-gray-600 font-medium">
                          {statusOk ? 'En línea' : 'Fuera de línea'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Válvula Solenoide */}
                  <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-4 border border-orange-200">
                    <h5 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                      <Settings className="w-4 h-4 text-orange-600 mr-2" />
                      Válvula Solenoide
                    </h5>
                    <div className="space-y-4">
                      {/* Válvula con animación de giro */}
                      <div className="relative mx-auto mb-8" style={{ width: '120px', height: '120px' }}>
                        <div className="absolute inset-0 flex items-center justify-center">
                          {/* Tuberías */}
                          <div className="absolute left-0 top-1/2 w-12 h-3 bg-gray-400 rounded-full transform -translate-y-1/2"></div>
                          <div className="absolute right-0 top-1/2 w-12 h-3 bg-gray-400 rounded-full transform -translate-y-1/2"></div>
                          
                          {/* Cuerpo de la válvula */}
                          <div className="relative w-16 h-16 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full shadow-lg border-2 border-gray-500 flex items-center justify-center">
                            {/* Válvula giratoria */}
                            <div 
                              className={`absolute w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full border-2 border-blue-700 transition-transform duration-500 ${
                                valveOpen ? 'rotate-90' : 'rotate-0'
                              }`}
                              style={{ transformOrigin: 'center' }}
                            >
                              {/* Indicador de flujo */}
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div 
                                  className={`w-1 h-8 bg-white rounded-full transition-opacity duration-300 ${
                                    valveOpen ? 'opacity-100' : 'opacity-30'
                                  }`}
                                ></div>
                              </div>
                              
                              {/* Líneas de flujo */}
                              {valveOpen && (
                                <>
                                  <div className="absolute top-1/2 left-1 w-2 h-0.5 bg-white animate-pulse"></div>
                                  <div className="absolute top-1/2 right-1 w-2 h-0.5 bg-white animate-pulse"></div>
                                </>
                              )}
                            </div>
                            
                            {/* Centro fijo */}
                            <div className="absolute w-4 h-4 bg-gray-600 rounded-full"></div>
                          </div>
                          
                          {/* Indicadores de entrada y salida */}
                          <div className="absolute left-2 top-1/2 transform -translate-y-1/2">
                            <div className={`w-2 h-2 rounded-full ${valveOpen ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`}></div>
                          </div>
                          <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                            <div className={`w-2 h-2 rounded-full ${valveOpen ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`}></div>
                          </div>
                          
                          {/* Flechas de flujo */}
                          {valveOpen && (
                            <>
                              <div className="absolute left-6 top-1/2 transform -translate-y-1/2">
                                <div className="w-0 h-0 border-r-2 border-r-green-400 border-t-1 border-t-transparent border-b-1 border-b-transparent animate-pulse"></div>
                              </div>
                              <div className="absolute right-6 top-1/2 transform -translate-y-1/2">
                                <div className="w-0 h-0 border-l-2 border-l-green-400 border-t-1 border-t-transparent border-b-1 border-b-transparent animate-pulse"></div>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                      
                      {/* Etiquetas separadas */}
                      <div className="flex justify-between text-xs text-gray-600 font-medium mb-4">
                        <span className="bg-white px-2 py-1 rounded shadow-sm border border-gray-200">Entrada</span>
                        <span className="bg-white px-2 py-1 rounded shadow-sm border border-gray-200">Salida</span>
                      </div>
                      
                      {/* Estado y control de la válvula */}
                      <div className="space-y-3">
                        {/* Estado */}
                        <div className="text-center">
                          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
                            valveOpen 
                              ? 'bg-green-100 text-green-800 border border-green-300' 
                              : 'bg-red-100 text-red-800 border border-red-300'
                          }`}>
                            <div className={`w-2 h-2 rounded-full ${valveOpen ? 'bg-green-500' : 'bg-red-500'}`}></div>
                            {valveOpen ? 'Abierta' : 'Cerrada'}
                          </div>
                        </div>
                        
                        {/* Botón de control */}
                        <div className="text-center">
                          <button
                            onClick={toggleValve}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm shadow-sm ${
                              valveOpen
                                ? 'bg-red-100 text-red-800 border border-red-300 hover:bg-red-200'
                                : 'bg-green-100 text-green-800 border border-green-300 hover:bg-green-200'
                            }`}
                          >
                            {valveOpen ? '🔒 Cerrar Válvula' : '🔓 Abrir Válvula'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Controles del sistema */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Settings className="w-5 h-5 text-gray-600 mr-2" />
                Controles del Sistema
              </h4>
              
              <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl p-6 border border-gray-200">
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Control manual del nivel */}
                  <div className="space-y-4">
                    <h5 className="text-sm font-semibold text-gray-700 flex items-center">
                      <Droplets className="w-4 h-4 text-blue-600 mr-2" />
                      Control de Nivel
                    </h5>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">Nivel actual:</span>
                        <span className="text-lg font-bold text-blue-600">{currentLevel}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={currentLevel}
                        onChange={(e) => {
                          const newLevel = Number(e.target.value);
                          setRows((prev) => {
                            const next = [
                              ...prev,
                              {
                                ts: new Date(),
                                nivel: newLevel,
                                sensor: Math.max(0, (prev.at(-1)?.sensor ?? 35) + (Math.random() * 1.2 - 0.6)),
                                valvula: prev.at(-1)?.valvula || "Abierta",
                                // signal: Math.max(40, Math.min(100, (prev.at(-1)?.signal ?? 80) + (Math.random() * 6 - 3))), // Eliminado según solicitud
                                note: "Ajuste manual",
                              },
                            ];
                            if (next.length > MAX_ROWS) next.splice(0, next.length - MAX_ROWS);
                            return next;
                          });
                        }}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span>0%</span>
                        <span>500L</span>
                      </div>
                    </div>
                  </div>

                  {/* Estado del sistema */}
                  <div className="space-y-4">
                    <h5 className="text-sm font-semibold text-gray-700 flex items-center">
                      <Activity className="w-4 h-4 text-green-600 mr-2" />
                      Estado del Sistema
                    </h5>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Válvula:</span>
                        <span className={`px-3 py-1 rounded-lg text-xs font-medium ${
                          valveOpen
                            ? isFilling 
                              ? 'bg-blue-100 text-blue-800 border border-blue-300'
                              : 'bg-green-100 text-green-800 border border-green-300'
                            : 'bg-red-100 text-red-800 border border-red-300'
                        }`}>
                          {isFilling ? 'Llenando...' : valveOpen ? 'Abierta' : 'Cerrada'}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Sensor:</span>
                        <span className={`px-3 py-1 rounded-lg text-xs font-medium ${
                          statusOk ? 'bg-green-100 text-green-800 border border-green-300' : 'bg-red-100 text-red-800 border border-red-300'
                        }`}>
                          {statusOk ? 'En línea' : 'Fuera de línea'}
                        </span>
                      </div>

                    </div>

                    {/* Indicador de llenado progresivo */}
                    {isFilling && (
                      <div className="space-y-2 bg-blue-50 rounded-lg p-3 border border-blue-200">
                        <div className="flex justify-between text-xs text-blue-700">
                          <span>Llenado automático</span>
                          <span>{currentLevel}%</span>
                        </div>
                        <div className="w-full bg-blue-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${currentLevel}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Historial + acciones */}
            <div className="rounded-xl border">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b p-3">
                <h4 className="text-sm font-semibold text-gray-700">Historial de telemetría</h4>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Simular registro */}
                  <button
                    onClick={addFakeRow}
                    className="inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50"
                    title="Agregar un registro de ejemplo"
                  >
                    <PlusCircle className="h-4 w-4" />
                    Simular registro
                  </button>

                  {/* Selector de fecha */}
                  <div className="relative inline-flex items-center rounded-md border px-2 py-1.5 text-xs text-gray-700">
                    <Calendar className="mr-2 h-4 w-4 text-gray-400" />
                    <input
                      type="date"
                      className="bg-transparent outline-none"
                      value={selectedDate ? dateKey(selectedDate) : ""}
                      onChange={(e) => {
                        if (!e.target.value) return;
                        setSelectedDate(new Date(e.target.value));
                      }}
                    />
                  </div>

                  {/* Paginación */}
                  <nav className="inline-flex items-center gap-1">
                    <button
                      className="rounded-md border px-2 py-1.5 text-xs text-gray-700 hover:bg-gray-50 disabled:opacity-40"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page <= 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>

                    {getPageNumbers(totalPages, page).map((p, idx) =>
                      p === "…" ? (
                        <span key={`dots-${idx}`} className="px-2 text-xs text-gray-400">…</span>
                      ) : (
                        <button
                          key={`p-${p}`}
                          onClick={() => setPage(p)}
                          className={`rounded-md border px-2 py-1.5 text-xs ${
                            p === page ? "bg-gray-900 text-white" : "text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          {p}
                        </button>
                      )
                    )}

                    <button
                      className="rounded-md border px-2 py-1.5 text-xs text-gray-700 hover:bg-gray-50 disabled:opacity-40"
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page >= totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </nav>
                </div>
              </div>

              {/* Tabla paginada */}
              <div className="max-h-[50vh] overflow-auto">
                {pageRows.length === 0 ? (
                  <div className="p-6 text-center text-sm text-gray-500">
                    Sin registros para la fecha seleccionada.
                  </div>
                ) : (
                  <table className="min-w-full text-sm">
                    <thead className="sticky top-0 bg-gray-50 text-gray-600">
                      <tr>
                        <th className="px-4 py-2 text-left">Fecha / hora</th>
                        <th className="px-4 py-2 text-right">Nivel (%)</th>
                        <th className="px-4 py-2 text-right">Sensor (cm)</th>
                        <th className="px-4 py-2 text-left">Válvula</th>
                        <th className="px-4 py-2 text-left">Nota</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pageRows.map((r, i) => (
                        <tr key={r.ts instanceof Date ? r.ts.getTime() : i} className="border-t">
                          <td className="px-4 py-2">{r.ts.toLocaleString()}</td>
                          <td className="px-4 py-2 text-right">{Math.round(r.nivel)}</td>
                          <td className="px-4 py-2 text-right">{Number(r.sensor ?? 0).toFixed(1)}</td>
                          <td className="px-4 py-2">{r.valvula}</td>
                          <td className="px-4 py-2">{r.note}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 border-t p-3">
            <button
              onClick={onClose}
              className="inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
