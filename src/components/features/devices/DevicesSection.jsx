import React, { useEffect, useMemo, useState } from "react";
import {
  Radar, RefreshCw, Plus, MapPin, Power, Clock,
  Droplets, Activity, Settings, Wrench, Download, Edit3
} from "lucide-react";
import FirmwareModal from "@/components/features/devices/FirmwareModal";
import SystemDetailsModal from "@/components/features/devices/SystemDetailsModal";
import AddDeviceModal from "@/components/features/devices/AddDeviceModal";
import EditDeviceModal from "@/components/features/devices/EditDeviceModal";
import { useAuth } from "@/context/AuthContext";

// Clave dinámica basada en el usuario actual
const getLSKey = (userId) => `gd_systems_${userId}`;

const loadSystems = (userId) => {
  try { 
    const key = getLSKey(userId);
    return JSON.parse(localStorage.getItem(key) || "[]"); 
  }
  catch { return []; }
};
const saveSystems = (arr, userId) => {
  try { 
    const key = getLSKey(userId);
    localStorage.setItem(key, JSON.stringify(arr)); 
  } catch (error) {
    console.warn('Error saving systems to localStorage:', error);
  }
};

// Función para exportar historial de telemetría a CSV
const exportTelemetryCSV = (system) => {
  // Generar datos de telemetría simulados (en una app real vendrían de la API)
  const telemetryData = [];
  const now = new Date();
  
  // Generar datos de los últimos 30 días
  for (let i = 0; i < 30; i++) {
    const date = new Date(now.getTime() - (i * 24 * 60 * 60 * 1000));
    const dayData = [];
    
    // Generar 24 horas de datos por día
    for (let hour = 0; hour < 24; hour++) {
      const timestamp = new Date(date.getTime() + (hour * 60 * 60 * 1000));
      const waterLevel = Math.max(0, Math.min(100, 60 + Math.sin(hour / 4) * 20 + Math.random() * 10 - 5));
      const temperature = 20 + Math.sin(hour / 6) * 5 + Math.random() * 3;
      const valveStatus = waterLevel > 80 ? 'closed' : 'open';
      
      dayData.push({
        timestamp: timestamp.toISOString(),
        waterLevel: waterLevel.toFixed(2),
        temperature: temperature.toFixed(2),
        valveStatus,
        // signal: Math.floor(85 + Math.random() * 15) // Eliminado según solicitud
      });
    }
    
    telemetryData.push(...dayData);
  }
  
  // Crear CSV
  const headers = ['Timestamp', 'Water Level (%)', 'Temperature (°C)', 'Valve Status'];
  const csvContent = [
    headers.join(','),
    ...telemetryData.map(row => [
      row.timestamp,
      row.waterLevel,
      row.temperature,
      row.valveStatus
    ].join(','))
  ].join('\n');
  
  // Descargar archivo
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `telemetry_${system.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// MIGRACIÓN: junta los 3 dispositivos sueltos (gd_devices) en 1 sistema con controller (ESP32)
const migrateLegacyIfNeeded = (userId) => {
  try {
    const legacy = JSON.parse(localStorage.getItem("gd_devices") || "[]");
    const current = loadSystems(userId);
    if (current.length || !Array.isArray(legacy) || legacy.length === 0) return;

    const modules = [];
    const pick = (type, fallbackName) => {
      const found = legacy.find(d => (d.type || "").toLowerCase().includes(type));
      if (!found) return null;
      return {
        key: type, // "nivel" | "sensor" | "actuador"
        name: found.name || fallbackName,
        status: found.status || "online",
        signal: found.signal ?? 0,
        location: found.location || "",
        lastSeen: found.lastSeen || new Date().toISOString(),
      };
    };
    const mTank   = pick("nivel",    "Tanque 500L");
    const mSensor = pick("sensor",   "Sensor HC-SR04");
    const mValve  = pick("actuador", "Válvula Solenoide");
    if (mTank)   modules.push(mTank);
    if (mSensor) modules.push(mSensor);
    if (mValve)  modules.push(mValve);

    // Controller (ESP32) derivado: online si alguno online; señal = máx; lastSeen más reciente.
    const anyOnline = legacy.some(d => d.status === "online");
    const bestSignal = Math.max(0, ...legacy.map(d => d.signal ?? 0));
    const lastSeen = legacy
      .map(d => new Date(d.lastSeen || Date.now()).getTime())
      .reduce((a, b) => Math.max(a, b), Date.now());

    const system = {
      id: "sys-" + Math.random().toString(36).slice(2, 8),
      name: "Sistema de Agua #1",
      location: mTank?.location || mSensor?.location || mValve?.location || "Planta piloto",
      createdAt: new Date().toISOString(),
      controller: {
        status: anyOnline ? "online" : "offline",
        signal: bestSignal,
        lastSeen: new Date(lastSeen).toISOString(),
      },
      modules,
    };

    saveSystems([system], userId);
    // Opcional: limpiar lo viejo
    // localStorage.removeItem("gd_devices");
  } catch (error) {
    console.warn('Error during legacy migration:', error);
  }
};

// SEED de demo si no hay nada
const seedIfEmpty = (userId) => {
  const cur = loadSystems(userId);
  if (cur.length) return cur;

  const demo = [{
    id: "sys-001",
    name: "Sistema de Agua #1",
    location: "Planta piloto",
    createdAt: new Date().toISOString(),
    controller: {
      status: "online",
      signal: 88,
      lastSeen: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    },
    modules: [
      {
        key: "nivel", name: "Tanque 500L", status: "online", signal: 92,
        location: "Bloque A • Lab 1",
        lastSeen: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        key: "sensor", name: "Sensor HC-SR04", status: "offline", signal: 0,
        location: "Bloque B • Sala 3",
        lastSeen: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        key: "actuador", name: "Válvula Solenoide", status: "online", signal: 77,
        location: "Planta piloto",
        lastSeen: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
  }];

  saveSystems(demo, userId);
  return demo;
};

const timeAgo = (iso) => {
  try {
    const diff = Date.now() - new Date(iso).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return "ahora";
    if (m < 60) return `${m} min`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h} h`;
    const d = Math.floor(h / 24);
    return `${d} d`;
  } catch { return "—"; }
};

const ModuleChip = ({ m }) => {
  const Icon =
    m.key === "nivel" ? Droplets :
    m.key === "sensor" ? Activity :
    Settings;
  const color =
    m.status === "online" ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300" : "bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300";
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs ${color}`}>
      <Icon className="h-3.5 w-3.5" />
      {m.name}
    </span>
  );
};

export default function DevicesSection() {
  const { user } = useAuth();
  const [systems, setSystems] = useState([]);
  const [openFw, setOpenFw] = useState(false);
  const [currentSystem, setCurrentSystem] = useState(null);
  const [openDetails, setOpenDetails] = useState(false);
  const [openAddDevice, setOpenAddDevice] = useState(false);
  const [openEditDevice, setOpenEditDevice] = useState(false);
  const [editingDevice, setEditingDevice] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!user?.id) return;
    
    migrateLegacyIfNeeded(user.id);
    setSystems(seedIfEmpty(user.id));
  }, [user?.id]);

  useEffect(() => {
    if (!user?.id) return;
    
    const userLSKey = getLSKey(user.id);
    const onStorage = (e) => {
      if (e.key === userLSKey) setSystems(loadSystems(user.id));
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [user?.id]);

  // MÉTRICAS desde controller
  const metrics = useMemo(() => {
    const total = systems.length;
    const online = systems.filter(sys => sys.controller?.status === "online").length;
    const offline = total - online;
    return { total, online, offline };
  }, [systems]);

  const refresh = () => {
    if (!user?.id) return;
    
    setRefreshing(true);
    setSystems(loadSystems(user.id));
    setTimeout(() => setRefreshing(false), 500);
  };

  // Función addSystem removida - no se usa actualmente

  // Función para manejar el guardado de nuevos dispositivos
  const handleSaveDevice = (deviceData) => {
    if (!user?.id) return;
    
    const newSystem = {
      id: `sys-${Date.now()}`,
      name: deviceData.name,
      type: deviceData.type,
      capacity: deviceData.capacity,
      unit: deviceData.unit,
      location: deviceData.location,
      building: deviceData.building,
      floor: deviceData.floor,
      room: deviceData.room,
      description: deviceData.description,
      manufacturer: deviceData.manufacturer,
      model: deviceData.model,
      serialNumber: deviceData.serialNumber,
      installationDate: deviceData.installationDate,
      maintenanceInterval: deviceData.maintenanceInterval,
      controller: {
        status: "online",
        signal: Math.floor(85 + Math.random() * 15),
        lastSeen: new Date().toISOString(),
      },
      modules: [
        { 
          key: "nivel", 
          name: `${deviceData.name} - Tanque ${deviceData.capacity}${deviceData.unit}`, 
          status: "online", 
          signal: Math.floor(85 + Math.random() * 15), 
          location: `${deviceData.building}${deviceData.floor ? ` - Piso ${deviceData.floor}` : ''}${deviceData.room ? ` - ${deviceData.room}` : ''}`, 
          lastSeen: new Date().toISOString() 
        },
        { 
          key: "sensor", 
          name: `${deviceData.name} - Sensor`, 
          status: "online", 
          signal: Math.floor(80 + Math.random() * 20), 
          location: `${deviceData.building}${deviceData.floor ? ` - Piso ${deviceData.floor}` : ''}${deviceData.room ? ` - ${deviceData.room}` : ''}`, 
          lastSeen: new Date().toISOString() 
        },
        { 
          key: "actuador", 
          name: `${deviceData.name} - Válvula`, 
          status: "online", 
          signal: Math.floor(75 + Math.random() * 25), 
          location: `${deviceData.building}${deviceData.floor ? ` - Piso ${deviceData.floor}` : ''}${deviceData.room ? ` - ${deviceData.room}` : ''}`, 
          lastSeen: new Date().toISOString() 
        },
      ],
      createdAt: new Date().toISOString(),
      status: deviceData.status,
      lastMaintenance: deviceData.lastMaintenance,
      nextMaintenance: deviceData.nextMaintenance
    };

    const updatedSystems = [...systems, newSystem];
    saveSystems(updatedSystems, user.id);
    setSystems(updatedSystems);
  };

  const handleUpdateDevice = (deviceData) => {
    if (!user?.id || !editingDevice) return;
    
    const updatedSystems = systems.map(sys => 
      sys.id === editingDevice.id 
        ? {
            ...sys,
            name: deviceData.name,
            type: deviceData.type,
            specs: deviceData.specs,
            location: deviceData.location,
            building: deviceData.building,
            floor: deviceData.floor,
            room: deviceData.room,
            description: deviceData.description,
            maintenanceInterval: deviceData.maintenanceInterval,
            status: deviceData.status,
            updatedAt: new Date().toISOString(),
            // Mantener la fecha de creación original si existe
            createdAt: sys.createdAt || new Date().toISOString()
          }
        : sys
    );
    
    saveSystems(updatedSystems, user.id);
    setSystems(updatedSystems);
    setEditingDevice(null);
    setOpenEditDevice(false);
  };

  const handleEditDevice = (device) => {
    setEditingDevice(device);
    setOpenEditDevice(true);
  };

  // Si no hay usuario autenticado, mostrar mensaje
  if (!user?.id) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-10 text-center">
          <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-gray-100 dark:bg-gray-700">
            <Radar className="h-7 w-7 text-gray-500 dark:text-gray-400" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Cargando dispositivos...</h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Esperando autenticación del usuario.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Título + acciones */}
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Dispositivos</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={refresh}
            disabled={refreshing}
            className="inline-flex items-center gap-2 rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-60">
            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            {refreshing ? "Actualizando…" : "Refrescar"}
          </button>
          <button onClick={() => setOpenAddDevice(true)} className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700">
            <Plus className="h-4 w-4" /> Agregar dispositivo
          </button>
        </div>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
          <p className="text-xs text-gray-500 dark:text-gray-400">Total</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-gray-100">{metrics.total}</p>
        </div>
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
          <p className="text-xs text-gray-500 dark:text-gray-400">En línea</p>
          <p className="mt-1 text-2xl font-semibold text-green-600">{metrics.online}</p>
        </div>
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
          <p className="text-xs text-gray-500 dark:text-gray-400">Fuera de línea</p>
          <p className="mt-1 text-2xl font-semibold text-rose-600">{metrics.offline}</p>
        </div>
      </div>

      {/* Vacío */}
      {systems.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-10 text-center">
          <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-gray-100 dark:bg-gray-700">
            <Radar className="h-7 w-7 text-gray-500 dark:text-gray-400" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Sin sistemas</h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Cuando conectes tu ESP32 aparecerá aquí.</p>
          <button onClick={refresh} className="mt-5 rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
            Volver a intentar
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {systems.map((sys) => {
            const online = sys.controller?.status === "online";
            const statusClass = online ? "bg-green-100 text-green-700" : "bg-rose-100 text-rose-700";
            const statusLabel = online ? "En línea" : "Fuera de línea";
            const lastSeen = sys.controller?.lastSeen || sys.modules[0]?.lastSeen;

            return (
              <article key={sys.id} className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 dark:bg-blue-900/30">
                      <Radar className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">{sys.name}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{sys.location}</p>
                    </div>
                  </div>
                  <span className={`rounded-full px-2 py-0.5 text-xs ${statusClass}`}>
                    {statusLabel}
                  </span>
                </div>

                {/* Módulos */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {sys.modules.map((m, i) => (<ModuleChip key={i} m={m} />))}
                </div>

                {/* Info rápida (desde controller) */}
                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <MapPin className="h-4 w-4 text-gray-400 dark:text-gray-500" /> <span className="truncate" title={sys.location}>{sys.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <Clock className="h-4 w-4 text-gray-400 dark:text-gray-500" /> Actualizado: {timeAgo(lastSeen)}
                  </div>
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <Power className="h-4 w-4 text-gray-400 dark:text-gray-500" /> ID: <span className="font-mono text-xs">{sys.id}</span>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-end gap-2">
                  {(() => {
                    const btn = {
                      primary:
                        "inline-flex items-center gap-2 rounded-md bg-indigo-600 px-3 py-1.5 text-xs text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300",
                      outline:
                        "inline-flex items-center gap-2 rounded-md border border-gray-300 dark:border-gray-600 px-3 py-1.5 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-600",
                      danger:
                        "inline-flex items-center gap-2 rounded-md border border-red-200 dark:border-red-700 px-3 py-1.5 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 focus:outline-none focus:ring-2 focus:ring-red-200 dark:focus:ring-red-700",
                    };

                    return (
                      <>
                        <button
                          className={btn.primary}
                          onClick={() => {
                            setCurrentSystem(sys);
                            setOpenDetails(true);
                          }}
                        >
                          Ver detalles
                        </button>

                        <button
                          className={btn.outline}
                          onClick={() => handleEditDevice(sys)}
                          title="Editar información del dispositivo"
                        >
                          <Edit3 className="h-3 w-3" />
                          Editar
                        </button>

                        <button
                          className={btn.outline}
                          onClick={() => exportTelemetryCSV(sys)}
                          title="Exportar historial de telemetría a CSV"
                        >
                          <Download className="h-3 w-3" />
                          Exportar CSV
                        </button>

                        <button
                          className={btn.outline}
                          onClick={() => {
                            setCurrentSystem(sys);
                            setOpenFw(true);
                          }}
                        >
                          Configurar
                        </button>

                        <button
                          className={btn.danger}
                          onClick={() => {
                            if (!user?.id) return;
                            const next = systems.filter((x) => x.id !== sys.id);
                            saveSystems(next, user.id);
                            setSystems(next);
                          }}
                        >
                          Eliminar
                        </button>
                      </>
                    );
                  })()}
                </div>
              </article>
            );
          })}
        </div>
      )}

      <FirmwareModal
        open={openFw}
        onClose={() => setOpenFw(false)}
        device={currentSystem}
      />

      <SystemDetailsModal
        open={openDetails}
        onClose={() => setOpenDetails(false)}
        system={currentSystem}    
      />

      <AddDeviceModal
        isOpen={openAddDevice}
        onClose={() => setOpenAddDevice(false)}
        onSave={handleSaveDevice}
      />

      <EditDeviceModal
        isOpen={openEditDevice}
        onClose={() => {
          setOpenEditDevice(false);
          setEditingDevice(null);
        }}
        onSave={handleUpdateDevice}
        device={editingDevice}
      />
    </div>
  );
}
