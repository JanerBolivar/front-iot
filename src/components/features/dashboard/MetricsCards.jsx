import React from 'react';
import { Activity, Wifi, WifiOff, AlertTriangle, Droplets } from 'lucide-react';

const MetricsCards = ({ systems = [], alerts = [] }) => {
  // Calcular métricas de dispositivos
  const totalDevices = systems.length;
  const onlineDevices = systems.filter(sys => sys.controller?.status === 'online').length;
  const offlineDevices = totalDevices - onlineDevices;

  // Calcular métricas de alertas
  const criticalAlerts = alerts.filter(alert => alert.type === 'critical').length;
  const warningAlerts = alerts.filter(alert => alert.type === 'warning').length;

  const metrics = [
    {
      title: 'Dispositivos Totales',
      value: totalDevices,
      icon: Activity,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/30',
      borderColor: 'border-blue-200 dark:border-blue-700'
    },
    {
      title: 'En Línea',
      value: onlineDevices,
      icon: Wifi,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/30',
      borderColor: 'border-green-200 dark:border-green-700'
    },
    {
      title: 'Fuera de Línea',
      value: offlineDevices,
      icon: WifiOff,
      color: 'text-red-600',
      bgColor: 'bg-red-50 dark:bg-red-900/30',
      borderColor: 'border-red-200 dark:border-red-700'
    },
    {
      title: 'Alertas Críticas',
      value: criticalAlerts,
      icon: AlertTriangle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-900/30',
      borderColor: 'border-orange-200 dark:border-orange-700'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        return (
          <div
            key={index}
            className={`rounded-xl border ${metric.borderColor} ${metric.bgColor} p-4 hover:shadow-md transition-shadow`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                  {metric.title}
                </p>
                <p className={`text-2xl font-bold ${metric.color}`}>
                  {metric.value}
                </p>
              </div>
              <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                <Icon className={`h-5 w-5 ${metric.color}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MetricsCards;
