import React from 'react';
import { BarChart3, Activity, Settings } from 'lucide-react';

const MathematicsSection = () => {
  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-br from-red-50 to-pink-100 dark:from-red-900/30 dark:to-pink-900/30 rounded-2xl p-8 border border-red-200 dark:border-red-700">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
          <BarChart3 className="w-8 h-8 text-red-600 mr-3" />
          Modelos Matemáticos
        </h2>
        <p className="text-gray-700 dark:text-gray-300 text-lg">
          Ecuaciones fundamentales que rigen el comportamiento del sistema de control 
          de nivel de agua.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
            <Activity className="w-5 h-5 text-purple-500 mr-2" />
            Sensor Ultrasónico HC-SR04
          </h3>
          <div className="space-y-4">
            <div className="bg-purple-50 dark:bg-purple-900/30 rounded-lg p-4">
              <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Cálculo de Distancia</h4>
              <div className="bg-white dark:bg-gray-700 rounded p-3 font-mono text-sm text-center border border-gray-200 dark:border-gray-600">
                d<sub>agua</sub> = (v<sub>sonido</sub> × t<sub>vuelo</sub>) / 2
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
                Donde v<sub>sonido</sub> = velocidad del sonido en el aire
              </p>
            </div>
            <div className="bg-indigo-50 dark:bg-indigo-900/30 rounded-lg p-4">
              <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Nivel de Agua</h4>
              <div className="bg-white dark:bg-gray-700 rounded p-3 font-mono text-sm text-center border border-gray-200 dark:border-gray-600">
                h = d<sub>fondo</sub> - d<sub>agua</sub>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">h = altura del agua en el tanque</p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4">
              <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Volumen de Agua</h4>
              <div className="bg-white dark:bg-gray-700 rounded p-3 font-mono text-sm text-center border border-gray-200 dark:border-gray-600">
                V = π × r² × h
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">Para tanque cilíndrico</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
            <Settings className="w-5 h-5 text-orange-500 mr-2" />
            Válvulas Solenoides
          </h3>
          <div className="space-y-4">
            <div className="bg-orange-50 dark:bg-orange-900/30 rounded-lg p-4">
              <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Caudal de Agua (Q)</h4>
              <div className="bg-white dark:bg-gray-700 rounded p-3 font-mono text-sm text-center border border-gray-200 dark:border-gray-600">
                Q = A<sub>efectiva</sub> × √(2 × g × Δh)
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">A<sub>efectiva</sub> = área efectiva de paso</p>
            </div>
            <div className="bg-red-50 dark:bg-red-900/30 rounded-lg p-4">
              <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Control de Apertura</h4>
              <div className="bg-white dark:bg-gray-700 rounded p-3 font-mono text-sm text-center border border-gray-200 dark:border-gray-600">
                x(t) = u(t - T)
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">x = estado válvula, u = señal control, T = tiempo respuesta</p>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-900/30 rounded-lg p-4">
              <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Conversión de Caudal</h4>
              <div className="bg-white dark:bg-gray-700 rounded p-3 font-mono text-sm text-center border border-gray-200 dark:border-gray-600">
                Q<sub>L/s</sub> = Q<sub>m³/s</sub> × 1000
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">Conversión a litros por segundo</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Variables del Sistema</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="space-y-3">
            <h4 className="font-medium text-gray-800 dark:text-gray-200 text-center">Sensor</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                <span className="text-gray-700 dark:text-gray-300">v<sub>sonido</sub></span>
                <span className="text-gray-800 dark:text-gray-200">343 m/s</span>
              </div>
              <div className="flex justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                <span className="text-gray-700 dark:text-gray-300">t<sub>vuelo</sub></span>
                <span className="text-gray-800 dark:text-gray-200">Variable</span>
              </div>
              <div className="flex justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                <span className="text-gray-700 dark:text-gray-300">d<sub>fondo</sub></span>
                <span className="text-gray-800 dark:text-gray-200">1.15 m</span>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <h4 className="font-medium text-gray-800 dark:text-gray-200 text-center">Tanque</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                <span className="text-gray-700 dark:text-gray-300">Radio</span>
                <span className="text-gray-800 dark:text-gray-200">0.325 m</span>
              </div>
              <div className="flex justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                <span className="text-gray-700 dark:text-gray-300">Altura</span>
                <span className="text-gray-800 dark:text-gray-200">1.15 m</span>
              </div>
              <div className="flex justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                <span className="text-gray-700 dark:text-gray-300">V<sub>max</sub></span>
                <span className="text-gray-800 dark:text-gray-200">500 L</span>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <h4 className="font-medium text-gray-800 dark:text-gray-200 text-center">Válvulas</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                <span className="text-gray-700 dark:text-gray-300">Diámetro</span>
                <span className="text-gray-800 dark:text-gray-200">1/2"</span>
              </div>
              <div className="flex justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                <span className="text-gray-700 dark:text-gray-300">Tiempo resp.</span>
                <span className="text-gray-800 dark:text-gray-200">50-100 ms</span>
              </div>
              <div className="flex justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                <span className="text-gray-700 dark:text-gray-300">Presión op.</span>
                <span className="text-gray-800 dark:text-gray-200">0-10 bar</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MathematicsSection;