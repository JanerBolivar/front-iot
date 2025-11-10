import React, { useState } from 'react';
import { X, MapPin, Settings, Droplets, Wifi, Save, AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import LoadingSpinner, { LoadingButton } from '@/components/common/LoadingSpinner';

export default function AddDeviceModal({ isOpen, onClose, onSave }) {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm({
    defaultValues: {
      name: '',
      type: 'esp32',
      specs: '240mhz',
      location: '',
      building: '',
      floor: '',
      room: '',
      description: '',
      manufacturer: '',
      model: '',
      serialNumber: '',
      installationDate: '',
      maintenanceInterval: 30,
      status: 'active'
    }
  });

  const deviceType = watch('type');

  const deviceTypes = [
    { value: 'esp32', label: 'ESP32 DevKit V1', icon: Wifi },
    { value: 'esp32-s3', label: 'ESP32-S3', icon: Wifi },
    { value: 'esp8266', label: 'ESP8266 NodeMCU', icon: Wifi },
    { value: 'arduino-uno', label: 'Arduino UNO R3', icon: Settings },
    { value: 'arduino-nano', label: 'Arduino Nano', icon: Settings },
    { value: 'raspberry-pi', label: 'Raspberry Pi 4', icon: Settings }
  ];

  const boardSpecs = {
    esp32: [
      { value: '240mhz', label: '240 MHz (Dual Core)' },
      { value: '520kb', label: '520 KB SRAM' },
      { value: '4mb', label: '4 MB Flash' },
      { value: 'wifi-bluetooth', label: 'WiFi + Bluetooth' }
    ],
    'esp32-s3': [
      { value: '240mhz', label: '240 MHz (Dual Core)' },
      { value: '512kb', label: '512 KB SRAM' },
      { value: '8mb', label: '8 MB Flash' },
      { value: 'wifi-bluetooth', label: 'WiFi + Bluetooth' }
    ],
    'esp8266': [
      { value: '80mhz', label: '80 MHz' },
      { value: '160kb', label: '160 KB SRAM' },
      { value: '4mb', label: '4 MB Flash' },
      { value: 'wifi-only', label: 'WiFi' }
    ],
    'arduino-uno': [
      { value: '16mhz', label: '16 MHz' },
      { value: '2kb', label: '2 KB SRAM' },
      { value: '32kb', label: '32 KB Flash' },
      { value: 'no-wireless', label: 'Sin conectividad inalámbrica' }
    ],
    'arduino-nano': [
      { value: '16mhz', label: '16 MHz' },
      { value: '2kb', label: '2 KB SRAM' },
      { value: '32kb', label: '32 KB Flash' },
      { value: 'no-wireless', label: 'Sin conectividad inalámbrica' }
    ],
    'raspberry-pi': [
      { value: '1800mhz', label: '1.8 GHz (Quad Core)' },
      { value: '4gb', label: '4 GB RAM' },
      { value: '32gb', label: '32 GB SD Card' },
      { value: 'wifi-bluetooth', label: 'WiFi + Bluetooth' }
    ]
  };

  const onSubmit = async (data) => {
    setLoading(true);
    const maintenanceInterval = Number(data.maintenanceInterval || 30);
    const now = new Date();

    const locationPayload = {
      ubicacion: data.location || "",
      bloque: data.building || "",
      piso: data.floor || "",
      laboratorio: data.room || "",
    };
      
      const deviceData = {
        ...data,
      maintenanceInterval,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
        lastMaintenance: null,
      nextMaintenance:
        maintenanceInterval > 0
          ? new Date(now.getTime() + maintenanceInterval * 24 * 60 * 60 * 1000).toISOString()
          : null,
      locationPayload,
      };

    try {
      await onSave(deviceData);
      reset();
      onClose();
    } catch (error) {
      console.error('Error al guardar la placa:', error);
      toast.error(error?.message || 'Error al guardar la placa');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[60] grid place-items-center bg-black/40 p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-xl">
        <div className="grid max-h-[85vh] grid-rows-[auto_1fr_auto]">
        
          {/* Header */}
          <div className="flex items-center justify-between border-b p-4">
            <div className="min-w-0">
              <h3 className="truncate text-lg font-semibold">
                Agregar Nueva Placa IoT
              </h3>
              <p className="text-xs text-gray-500">Configura los detalles de tu placa de desarrollo</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                aria-label="Cerrar"
                onClick={handleClose}
                className="rounded-md p-2 text-gray-600 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="overflow-y-auto p-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Información Básica */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Información Básica
              </h3>
            
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nombre del Dispositivo *
                  </label>
                  <input
                    {...register('name', { required: 'El nombre es obligatorio' })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Ej: Placa Principal ESP32"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Tipo de Placa *
                  </label>
                  <select
                    {...register('type', { required: 'El tipo de placa es obligatorio' })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    {deviceTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Especificaciones *
                  </label>
                  <select
                    {...register('specs', { required: 'Las especificaciones son obligatorias' })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    {boardSpecs[deviceType]?.map(spec => (
                      <option key={spec.value} value={spec.value}>
                        {spec.label}
                      </option>
                    )) || <option value="standard">Estándar</option>}
                  </select>
                  {errors.specs && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.specs.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Estado
                  </label>
                  <select
                    {...register('status')}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="active">Activo</option>
                    <option value="inactive">Inactivo</option>
                    <option value="maintenance">Mantenimiento</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Ubicación */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Ubicación
              </h3>
              
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Edificio/Bloque *
                  </label>
                  <input
                    {...register('building', { required: 'El edificio es obligatorio' })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Bloque A"
                  />
                  {errors.building && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.building.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Piso
                  </label>
                  <input
                    {...register('floor')}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Sala/Laboratorio
                  </label>
                  <input
                    {...register('room')}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Lab 1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Ubicación Específica
                </label>
                <input
                  {...register('location')}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Cerca de la entrada principal"
                />
              </div>
            </div>

            {/* Descripción */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Información Adicional
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Descripción
                </label>
                <textarea
                  {...register('description')}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Descripción de la placa y su uso..."
                />
              </div>
            </div>

            {/* Mantenimiento */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
                <Droplets className="w-5 h-5" />
                Configuración de Mantenimiento
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Intervalo de Mantenimiento (días)
                </label>
                <input
                  type="number"
                  {...register('maintenanceInterval', { 
                    min: { value: 1, message: 'Mínimo 1 día' },
                    max: { value: 365, message: 'Máximo 365 días' }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="30"
                />
                {errors.maintenanceInterval && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.maintenanceInterval.message}
                  </p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-6">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Cancelar
              </button>
              
              <LoadingButton
                type="submit"
                loading={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Guardar Placa
              </LoadingButton>
            </div>
          </form>
          </div>
        </div>
      </div>
    </div>
  );
}
