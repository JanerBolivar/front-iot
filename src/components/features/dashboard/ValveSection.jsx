import React from 'react';
import { Settings } from 'lucide-react';
import ValveDemo from './ValveDemo';

const ValveSection = () => {
  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-br from-orange-50 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 rounded-2xl p-8 border border-orange-200 dark:border-orange-700">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
          <Settings className="w-8 h-8 text-orange-600 mr-3" />
          Válvula Solenoide
        </h2>
        <p className="text-gray-700 dark:text-gray-300 text-lg">
          Actuador electromecánico para el control preciso del flujo de agua en el sistema.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Especificaciones Técnicas
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <span className="font-medium text-gray-700 dark:text-gray-300">Dimensiones:</span>
              <span className="text-gray-800 dark:text-gray-200">80 × 32 × 70 mm</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <span className="font-medium text-gray-700 dark:text-gray-300">Entrada:</span>
              <span className="text-gray-800 dark:text-gray-200">Rosca 1/2"</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <span className="font-medium text-gray-700 dark:text-gray-300">Salida:</span>
              <span className="text-gray-800 dark:text-gray-200">Manguera 1/2"</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <span className="font-medium text-gray-700 dark:text-gray-300">Tipo:</span>
              <span className="text-gray-800 dark:text-gray-200">Normalmente cerrada</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <span className="font-medium text-gray-700 dark:text-gray-300">Actuación:</span>
              <span className="text-gray-800 dark:text-gray-200">Electromagnética</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Componentes Modelados
          </h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="bg-orange-500 w-3 h-3 rounded-full mt-2"></div>
              <div>
                <p className="font-medium text-gray-800 dark:text-gray-200">Bobina Electromagnética</p>
                <p className="text-gray-600 dark:text-gray-400">Genera campo magnético para activación</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-red-500 w-3 h-3 rounded-full mt-2"></div>
              <div>
                <p className="font-medium text-gray-800 dark:text-gray-200">Cubierta Metálica</p>
                <p className="text-gray-600 dark:text-gray-400">Protección con etiquetas técnicas</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-yellow-500 w-3 h-3 rounded-full mt-2"></div>
              <div>
                <p className="font-medium text-gray-800 dark:text-gray-200">Mecanismo Interno</p>
                <p className="text-gray-600 dark:text-gray-400">Émbolo, resorte y sello de goma</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-blue-500 w-3 h-3 rounded-full mt-2"></div>
              <div>
                <p className="font-medium text-gray-800 dark:text-gray-200">Conexiones de Flujo</p>
                <p className="text-gray-600 dark:text-gray-400">Entrada y salida para tuberías</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6">
          Estados de Funcionamiento
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-lg p-6 border border-green-200 dark:border-green-700">
            <div className="flex items-center mb-3">
              <div className="bg-green-500 w-3 h-3 rounded-full mr-3"></div>
              <h4 className="font-semibold text-gray-800 dark:text-gray-200">Estado Abierto</h4>
            </div>
            <p className="text-gray-700 dark:text-gray-300 text-sm mb-3">
              La bobina recibe señal eléctrica y el émbolo se desplaza, permitiendo 
              el flujo de agua.
            </p>
            <div className="bg-white dark:bg-gray-700 rounded p-3 text-xs font-mono text-gray-600 dark:text-gray-300">
              Estado = 1 (Señal activa)
            </div>
          </div>
          <div className="bg-gradient-to-br from-red-50 to-rose-100 dark:from-red-900/30 dark:to-rose-900/30 rounded-lg p-6 border border-red-200 dark:border-red-700">
            <div className="flex items-center mb-3">
              <div className="bg-red-500 w-3 h-3 rounded-full mr-3"></div>
              <h4 className="font-semibold text-gray-800 dark:text-gray-200">Estado Cerrado</h4>
            </div>
            <p className="text-gray-700 dark:text-gray-300 text-sm mb-3">
              Sin señal eléctrica, el resorte mantiene el émbolo en posición, 
              bloqueando el flujo.
            </p>
            <div className="bg-white dark:bg-gray-700 rounded p-3 text-xs font-mono text-gray-600 dark:text-gray-300">
              Estado = 0 (Sin señal)
            </div>
          </div>
        </div>
      </div>

      {/* Demostración Interactiva de la Válvula */}
      <ValveDemo />
    </div>
  );
};

export default ValveSection;