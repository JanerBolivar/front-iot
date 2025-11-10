import React, { useState, useEffect } from 'react';
import { X, MapPin, Settings, Droplets, Wifi, Save, AlertCircle, Edit3 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import LoadingSpinner, { LoadingButton } from '@/components/common/LoadingSpinner';

export default function EditDeviceModal({ isOpen, onClose, onSave, device }) {
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

  // Cargar datos del dispositivo cuando se abre el modal
  useEffect(() => {
    if (isOpen && device) {
      const locationSource =
        device.locationPayload ||
        device.locationData ||
        device.location ||
        {};

      const locationString =
        typeof locationSource === "object" && locationSource !== null
          ? locationSource.ubicacion ||
            locationSource.ubicacionGeneral ||
            locationSource.general ||
            ""
          : (device.location || "");

      const building =
        device.building ??
        (typeof locationSource === "object" ? locationSource.bloque : undefined) ??
        "";

      const floor =
        device.floor ??
        (typeof locationSource === "object" ? locationSource.piso : undefined) ??
        "";

      const room =
        device.room ??
        (typeof locationSource === "object" ? locationSource.laboratorio : undefined) ??
        "";

      reset({
        name: device.name || '',
        type: device.type || 'esp32',
        specs: device.specs || '240mhz',
        location: locationString,
        building,
        floor,
        room,
        description: device.description || '',
        manufacturer: device.manufacturer || '',
        model: device.model || '',
        serialNumber: device.serialNumber || '',
        installationDate: device.installationDate || '',
        maintenanceInterval: device.maintenanceInterval || 30,
        status: device.status || 'active'
      });
    }
  }, [isOpen, device, reset]);

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
      { value: 'wifi-bluetooth-le', label: 'WiFi + Bluetooth LE' }
    ],
    'esp8266': [
      { value: '80mhz', label: '80 MHz (Single Core)' },
      { value: '160kb', label: '160 KB SRAM' },
      { value: '4mb', label: '4 MB Flash' },
      { value: 'wifi-only', label: 'WiFi Only' }
    ],
    'arduino-uno': [
      { value: '16mhz', label: '16 MHz (ATmega328P)' },
      { value: '2kb', label: '2 KB SRAM' },
      { value: '32kb', label: '32 KB Flash' },
      { value: 'no-wireless', label: 'Sin conectividad inalámbrica' }
    ],
    'arduino-nano': [
      { value: '16mhz', label: '16 MHz (ATmega328P)' },
      { value: '2kb', label: '2 KB SRAM' },
      { value: '32kb', label: '32 KB Flash' },
      { value: 'no-wireless', label: 'Sin conectividad inalámbrica' }
    ],
    'raspberry-pi': [
      { value: '1.5ghz', label: '1.5 GHz (Quad Core ARM)' },
      { value: '4gb', label: '4 GB RAM' },
      { value: '32gb', label: '32 GB eMMC' },
      { value: 'wifi-bluetooth-gpio', label: 'WiFi + Bluetooth + GPIO' }
    ]
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const locationPayload = {
        ubicacion: data.location || device?.locationData?.ubicacion || "",
        bloque: data.building || device?.locationData?.bloque || "",
        piso: data.floor || device?.locationData?.piso || "",
        laboratorio: data.room || device?.locationData?.laboratorio || "",
      };

      await onSave({
        ...device,
        ...data,
        locationPayload,
      });

      onClose();
    } catch (error) {
      console.error('Error al actualizar dispositivo:', error);
      toast.error('Error al actualizar el dispositivo');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50" onClick={onClose} />
        
        <div className="relative w-full max-w-4xl bg-white dark:bg-gray-800 rounded-2xl shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Edit3 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Editar Dispositivo
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Modifica la información del dispositivo
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Información Básica */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-blue-600" />
                  Información Básica
                </h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nombre del Dispositivo *
                  </label>
                  <input
                    {...register('name', { required: 'El nombre es requerido' })}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="Ej: Tanque Principal - Bloque A"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tipo de Dispositivo *
                  </label>
                  <select
                    {...register('type', { required: 'El tipo es requerido' })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  >
                    {deviceTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                  {errors.type && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.type.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Especificaciones *
                  </label>
                  <select
                    {...register('specs', { required: 'Las especificaciones son requeridas' })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  >
                    {boardSpecs[deviceType]?.map((spec) => (
                      <option key={spec.value} value={spec.value}>
                        {spec.label}
                      </option>
                    ))}
                  </select>
                  {errors.specs && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.specs.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Descripción
                  </label>
                  <textarea
                    {...register('description')}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 resize-none"
                    placeholder="Describe el propósito y uso del dispositivo..."
                  />
                </div>
              </div>

              {/* Ubicación */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-green-600" />
                  Ubicación
                </h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Ubicación General *
                  </label>
                  <input
                    {...register('location', { required: 'La ubicación es requerida' })}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="Ej: Planta piloto, Laboratorio, etc."
                  />
                  {errors.location && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.location.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Edificio
                    </label>
                    <input
                      {...register('building')}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      placeholder="Bloque A"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Piso
                    </label>
                    <input
                      {...register('floor')}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      placeholder="1er piso"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Sala/Laboratorio
                  </label>
                  <input
                    {...register('room')}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="Sala 301"
                  />
                </div>
              </div>

              {/* Información de Registro */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <Droplets className="w-5 h-5 text-purple-600" />
                  Información de Registro
                </h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Fecha de Creación
                  </label>
                  <input
                    type="text"
                    value={device?.createdAt ? new Date(device.createdAt).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    }) : 'No disponible'}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-600 text-gray-700 dark:text-gray-300 cursor-not-allowed"
                    disabled
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Última Edición
                  </label>
                  <input
                    type="text"
                    value={device?.updatedAt ? new Date(device.updatedAt).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    }) : 'Nunca editado'}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-600 text-gray-700 dark:text-gray-300 cursor-not-allowed"
                    disabled
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    ID del Sistema
                  </label>
                  <input
                    type="text"
                    value={device?.id || 'No disponible'}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-600 text-gray-700 dark:text-gray-300 cursor-not-allowed font-mono text-sm"
                    disabled
                  />
                </div>
              </div>

              {/* Configuración */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-orange-600" />
                  Configuración
                </h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Intervalo de Mantenimiento (días)
                  </label>
                  <input
                    {...register('maintenanceInterval', { 
                      required: 'El intervalo es requerido',
                      min: { value: 1, message: 'Mínimo 1 día' },
                      max: { value: 365, message: 'Máximo 365 días' }
                    })}
                    type="number"
                    min="1"
                    max="365"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="30"
                  />
                  {errors.maintenanceInterval && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.maintenanceInterval.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Estado
                  </label>
                  <select
                    {...register('status')}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  >
                    <option value="active">Activo</option>
                    <option value="inactive">Inactivo</option>
                    <option value="maintenance">En Mantenimiento</option>
                    <option value="retired">Retirado</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <LoadingButton
                type="submit"
                loading={loading}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors"
              >
                <Save className="w-4 h-4" />
                {loading ? 'Actualizando...' : 'Actualizar Dispositivo'}
              </LoadingButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
