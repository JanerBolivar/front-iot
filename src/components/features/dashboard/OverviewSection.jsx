import React, { useEffect, useState } from 'react';
import { Waves, Droplets, Activity, Settings, Monitor } from 'lucide-react';
import { Alert, AlertDescription } from "../../common/Alert/alert";
import MetricsCards from './MetricsCards';
import TrendsChart from './TrendsChart';
import AlertsPanel from './AlertsPanel';
import { useAuth } from '@/context/AuthContext';


const OverviewSection = () => {
  const { user } = useAuth();
  const [systems, setSystems] = useState([]);

  // Cargar sistemas del usuario (similar a DevicesSection)
  useEffect(() => {
    if (!user?.id) return;
    
    try {
      const key = `gd_systems_${user.id}`;
      const systemsData = JSON.parse(localStorage.getItem(key) || "[]");
      setSystems(systemsData);
    } catch (error) {
      console.warn('Error loading systems:', error);
      setSystems([]);
    }
  }, [user?.id]);

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-2xl p-8 border border-blue-200 dark:border-blue-700">
        <div className="flex items-center space-x-4 mb-6">
          <div className="bg-blue-500 p-3 rounded-full">
            <Waves className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
              Gemelo Digital - Sistema de Control de Agua
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Universidad de la Amazonia - Programa de Ingeniería de Sistemas
            </p>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Autores</h3>
            <div className="space-y-2">
              <p className="text-gray-700 dark:text-gray-300">• [Autor 1]</p>
              <p className="text-gray-700 dark:text-gray-300">• [Autor 2]</p>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Ubicación</h3>
            <p className="text-gray-700 dark:text-gray-300">
              Florencia - Caquetá<br/>2025-1
            </p>
          </div>
        </div>
      </div>

      {/* Métricas Principales y Sistema de Alertas */}
      <div className="space-y-6">
        <MetricsCards systems={systems} />
        
        <div className="grid lg:grid-cols-2 gap-6">
          <TrendsChart systems={systems} />
          <AlertsPanel systems={systems} />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-3 mb-4">
            <Droplets className="w-6 h-6 text-cyan-500" />
            <h3 className="font-semibold text-gray-800 dark:text-gray-200">Tanque de Agua</h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Capacidad de 500 litros con estructura cilíndrica vertical de polietileno de alta densidad.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-3 mb-4">
            <Activity className="w-6 h-6 text-purple-500" />
            <h3 className="font-semibold text-gray-800 dark:text-gray-200">Sensor Ultrasónico</h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            HC-SR04 para medición de nivel de agua mediante principio de tiempo de vuelo.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-3 mb-4">
            <Settings className="w-6 h-6 text-orange-500" />
            <h3 className="font-semibold text-gray-800 dark:text-gray-200">Válvulas Solenoides</h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Actuadores electromecánicos para control de flujo de entrada y salida de agua.
          </p>
        </div>
      </div>

      <Alert className="border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/30">
        <Monitor className="h-4 w-4" />
        <AlertDescription className="text-blue-800 dark:text-blue-300">
          Este gemelo digital será implementado en Unity con realidad aumentada para 
          simulaciones interactivas y educativas.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default OverviewSection;