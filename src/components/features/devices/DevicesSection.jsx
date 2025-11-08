import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Radar, RefreshCw, Plus, MapPin, Power, Clock,
  Droplets, Activity, Settings, Wrench, Download, Edit3
} from "lucide-react";
import { toast } from "sonner";
import FirmwareModal from "@/components/features/devices/FirmwareModal";
import SystemDetailsModal from "@/components/features/devices/SystemDetailsModal";
import AddDeviceModal from "@/components/features/devices/AddDeviceModal";
import EditDeviceModal from "@/components/features/devices/EditDeviceModal";
import { useAuth } from "@/context/AuthContext";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import axios from "axios";
import apiService from "@/services/api";

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

const buildLocationString = (device) => {
  const parts = [];
  if (device.building) parts.push(device.building);
  if (device.floor) parts.push(`Piso ${device.floor}`);
  if (device.room) parts.push(device.room);
  return parts.join(" • ") || device.location || device.deviceLocation || "Ubicación no especificada";
};

const normalizeDevice = (raw) => {
  const now = new Date().toISOString();
  const id = raw.id || raw.deviceId || `sys-${Math.random().toString(36).slice(2, 10)}`;
  const firstName = raw.firstName || raw.userFirstName || "";
  const lastName = raw.lastName || raw.userLastName || "";
  const responsible = raw.responsible || [firstName, lastName].filter(Boolean).join(" ");

  const name =
    raw.name ||
    raw.deviceName ||
    raw.title ||
    (responsible ? `Dispositivo de ${responsible}` : "Dispositivo sin nombre");

  const status = raw.status || raw.controller?.status || "online";
  const signal = raw.signal ?? raw.controller?.signal ?? 90;
  const lastSeen = raw.lastSeen || raw.controller?.lastSeen || now;
  const location = buildLocationString(raw);

  const controller = {
    status,
    signal,
    lastSeen,
    ...(raw.controller || {}),
  };

  const baseModules = [
    {
      key: "nivel",
      name: `${name} - Tanque`,
    },
    {
      key: "sensor",
      name: `${name} - Sensor`,
    },
    {
      key: "actuador",
      name: `${name} - Válvula`,
    },
  ];

  const modulesSource = Array.isArray(raw.modules) && raw.modules.length ? raw.modules : baseModules;
  const modules = modulesSource.map((module, index) => ({
    key: module.key || module.moduleKey || baseModules[index]?.key || `module-${index}`,
    name: module.name || module.moduleName || baseModules[index]?.name || `Módulo ${index + 1}`,
    status: module.status || status,
    signal: module.signal ?? signal,
    location: module.location || location,
    lastSeen: module.lastSeen || lastSeen,
  }));

  return {
    id,
    name,
    controller,
    modules,
    location,
    building: raw.building || "",
    floor: raw.floor || "",
    room: raw.room || "",
    description: raw.description || "",
    maintenanceInterval: raw.maintenanceInterval ?? 30,
    nextMaintenance: raw.nextMaintenance || null,
    lastMaintenance: raw.lastMaintenance || null,
    createdAt: raw.createdAt || now,
    updatedAt: raw.updatedAt || now,
    userId: raw.userId || raw.ownerId,
    status,
  };
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
  const { user, token } = useAuth();
  const [systems, setSystems] = useState([]);
  const [loadingDevices, setLoadingDevices] = useState(true);
  const [error, setError] = useState("");
  const [openFw, setOpenFw] = useState(false);
  const [currentSystem, setCurrentSystem] = useState(null);
  const [openDetails, setOpenDetails] = useState(false);
  const [openAddDevice, setOpenAddDevice] = useState(false);
  const [openEditDevice, setOpenEditDevice] = useState(false);
  const [editingDevice, setEditingDevice] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDevices = async () => {
    try {
      const response = await apiService.getDevices(token);
      setSystems(response || []);
    } catch (error) {
      console.error('Error fetching devices:', error);
    } finally {
      setLoadingDevices(false);
    }
  };

  useEffect(() => {
    if (!user?.uuid) return;

    fetchDevices();
    // setSystems(seedIfEmpty(user.uuid));
  }, [user?.uuid]);

  // MÉTRICAS desde controller
  const metrics = useMemo(() => {
    const total = systems.length;
    const online = true;
    const offline = total - online;
    return { total, online, offline };
  }, [systems]);

  const refresh = () => {
    if (!user?.uuid) return;
    setRefreshing(true);
    fetchDevices().finally(() => setRefreshing(false));
  };

  // Función para manejar el guardado de nuevos dispositivos
  const handleSaveDevice = async (deviceData) => {
    if (!user?.uuid) return;

    const payload = {
      ...deviceData,
      userId: user.uuid,
    };

    try {
      const response = await apiService.createDevice(payload);
      const created = response?.device || response || {};
      const normalized = normalizeDevice({
        ...payload,
        ...created,
      });
      setSystems((prev) => [...prev, normalized]);
      toast.success("Dispositivo creado correctamente");
      return normalized;
    } catch (error) {
      console.error("Error creando dispositivo:", error);
      toast.error(error?.message || "No se pudo crear el dispositivo");
      throw error;
    }
  };

  const handleUpdateDevice = async (deviceData) => {
    if (!user?.id || !editingDevice) return;

    try {
      const payload = {
        ...deviceData,
        userId: editingDevice.userId || user.id,
      };
      const response = await apiService.updateDevice(editingDevice.id, payload);
      const updated = response?.device || response || {};
      const normalized = normalizeDevice({
        ...editingDevice,
        ...payload,
        ...updated,
      });

      setSystems((prev) =>
        prev.map((sys) => (sys.id === editingDevice.id ? normalized : sys))
      );
      toast.success("Dispositivo actualizado correctamente");
      setEditingDevice(null);
      setOpenEditDevice(false);
      return normalized;
    } catch (error) {
      console.error("Error actualizando dispositivo:", error);
      toast.error(error?.message || "No se pudo actualizar el dispositivo");
      throw error;
    }
  };

  const handleEditDevice = (device) => {
    setEditingDevice(device);
    setOpenEditDevice(true);
  };

  const handleDeleteDevice = async (deviceId) => {
    try {
      await apiService.deleteDevice(deviceId);
      setSystems((prev) => prev.filter((sys) => sys.id !== deviceId));
      if (currentSystem?.id === deviceId) {
        setCurrentSystem(null);
      }
      toast.success("Dispositivo eliminado");
    } catch (error) {
      console.error("Error eliminando dispositivo:", error);
      toast.error(error?.message || "No se pudo eliminar el dispositivo");
    }
  };

  // Si no hay usuario autenticado, mostrar mensaje
  if (!user?.uuid) {
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

  if (loadingDevices) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-10 text-center">
          <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-gray-100 dark:bg-gray-700">
            <LoadingSpinner />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Cargando dispositivos...</h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Obteniendo información desde la API.</p>
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

      {error && (
        <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:border-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
          {error}
        </div>
      )}

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
            const online = true;
            const statusClass = online ? "bg-green-100 text-green-700" : "bg-rose-100 text-rose-700";
            const statusLabel = online ? "En línea" : "Fuera de línea";
            const lastSeen = sys.updatedAt;

            return (
              <article key={sys.id} className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 dark:bg-blue-900/30">
                      <Radar className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">{sys.name}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{sys.location.ubicacion || "No Aplica"}</p>
                    </div>
                  </div>
                  <span className={`rounded-full px-2 py-0.5 text-xs ${statusClass}`}>
                    {statusLabel}
                  </span>
                </div>

                {/* Módulos */}
                <div className="mt-3 flex flex-wrap gap-2">
                  No Aplica
                  {/*  {sys.modules.map((m, i) => (<ModuleChip key={i} m={m} />))} */}
                </div>

                {/* Info rápida (desde controller) */}
                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <MapPin className="h-4 w-4 text-gray-400 dark:text-gray-500" /> <span className="truncate" title={sys.location.ubicacion || "No Aplica"}>{sys.location.ubicacion || "No Aplica"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <Clock className="h-4 w-4 text-gray-400 dark:text-gray-500" /> Actualizado: {timeAgo(lastSeen)}
                  </div>
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <Power className="h-4 w-4 text-gray-400 dark:text-gray-500" /> ID: <span className="font-mono text-xs">{sys.uuid}</span>
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
                          onClick={() => handleDeleteDevice(sys.id)}
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
