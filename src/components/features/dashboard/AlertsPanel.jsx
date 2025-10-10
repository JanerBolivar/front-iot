import React, { useMemo } from 'react';
import { AlertTriangle, WifiOff, Droplets, Clock, X } from 'lucide-react';

const AlertsPanel = ({ systems = [] }) => {
  // Generar alertas basadas en el estado de los sistemas
  const alerts = useMemo(() => {
    const alertList = [];
    const now = new Date();

    systems.forEach(system => {
      // Alerta por dispositivo offline
      if (system.controller?.status === 'offline') {
        alertList.push({
          id: `offline-${system.id}`,
          type: 'critical',
          title: 'Dispositivo Fuera de Línea',
          message: `${system.name} no responde desde hace más de 5 minutos`,
          timestamp: new Date(now.getTime() - Math.random() * 3600000), // Última hora
          icon: WifiOff,
          systemId: system.id
        });
      }

      // Simular alertas de nivel (en un sistema real vendrían de datos reales)
      const simulatedLevel = Math.random() * 100;
      
      if (simulatedLevel < 20) {
        alertList.push({
          id: `low-level-${system.id}`,
          type: 'critical',
          title: 'Nivel Crítico Bajo',
          message: `${system.name} - Nivel de agua por debajo del 20%`,
          timestamp: new Date(now.getTime() - Math.random() * 1800000), // Última media hora
          icon: Droplets,
          systemId: system.id
        });
      } else if (simulatedLevel > 90) {
        alertList.push({
          id: `high-level-${system.id}`,
          type: 'warning',
          title: 'Nivel Crítico Alto',
          message: `${system.name} - Nivel de agua por encima del 90%`,
          timestamp: new Date(now.getTime() - Math.random() * 1800000),
          icon: Droplets,
          systemId: system.id
        });
      }
    });

    // Ordenar por timestamp (más recientes primero)
    return alertList.sort((a, b) => b.timestamp - a.timestamp);
  }, [systems]);

  const getAlertIcon = (type) => {
    switch (type) {
      case 'critical':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getAlertBgColor = (type) => {
    switch (type) {
      case 'critical':
        return 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-700';
      case 'warning':
        return 'bg-orange-50 dark:bg-orange-900/30 border-orange-200 dark:border-orange-700';
      default:
        return 'bg-gray-50 dark:bg-gray-900/30 border-gray-200 dark:border-gray-700';
    }
  };

  const formatTimeAgo = (timestamp) => {
    const diff = Date.now() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Hace un momento';
    if (minutes < 60) return `Hace ${minutes} min`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `Hace ${hours}h`;
    
    const days = Math.floor(hours / 24);
    return `Hace ${days}d`;
  };

  if (alerts.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Sistema de Alertas
          </h3>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-green-600 dark:text-green-400">Todo normal</span>
          </div>
        </div>
        <div className="text-center py-8">
          <div className="mx-auto w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-3">
            <AlertTriangle className="h-6 w-6 text-green-600" />
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            No hay alertas activas. Todos los sistemas funcionan correctamente.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          Sistema de Alertas
        </h3>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-red-600 dark:text-red-400">
            {alerts.length} alerta{alerts.length > 1 ? 's' : ''}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {alerts.slice(0, 5).map((alert) => (
          <div
            key={alert.id}
            className={`rounded-lg border p-4 ${getAlertBgColor(alert.type)}`}
          >
            <div className="flex items-start gap-3">
              {getAlertIcon(alert.type)}
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-800 dark:text-gray-200">
                    {alert.title}
                  </h4>
                  <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatTimeAgo(alert.timestamp)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {alert.message}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {alerts.length > 5 && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
            Y {alerts.length - 5} alerta{alerts.length - 5 > 1 ? 's' : ''} más...
          </p>
        </div>
      )}
    </div>
  );
};

export default AlertsPanel;
