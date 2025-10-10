import React from 'react';
import { Container, Beaker, Target, Cpu, Droplets, Activity, Settings } from 'lucide-react';

const ComponentsSection = () => {
  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-green-50 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-2xl p-8 border border-green-200 dark:border-green-700">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
          <Container className="w-8 h-8 text-green-600 mr-3" />
          Diseño en 3D de los Objetos
        </h2>
        <p className="text-gray-700 dark:text-gray-300 text-lg">
          Representación tridimensional precisa de cada componente del sistema.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
            <Beaker className="w-5 h-5 text-blue-500 mr-2" />
            Fase 1: Herramientas
          </h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="bg-orange-500 w-3 h-3 rounded-full mt-2"></div>
              <div>
                <p className="font-medium text-gray-800 dark:text-gray-200">Blender</p>
                <p className="text-gray-600 dark:text-gray-400">
                  Modelado 3D con alta flexibilidad para objetos tridimensionales.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-purple-500 w-3 h-3 rounded-full mt-2"></div>
              <div>
                <p className="font-medium text-gray-800 dark:text-gray-200">Illustrator</p>
                <p className="text-gray-600 dark:text-gray-400">
                  Creación de imágenes vectoriales y elementos gráficos de alta calidad.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
            <Target className="w-5 h-5 text-green-500 mr-2" />
            Fase 2: Características
          </h3>
          <div className="space-y-3">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
              <p className="font-medium text-gray-800 dark:text-gray-200">Dimensiones Precisas</p>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Medidas exactas basadas en objetos reales</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
              <p className="font-medium text-gray-800 dark:text-gray-200">Materiales Simulados</p>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Texturas realistas de polietileno, metal y plástico
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
              <p className="font-medium text-gray-800 dark:text-gray-200">Comportamiento Dinámico</p>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Interacciones funcionales entre componentes
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
          <Cpu className="w-5 h-5 text-purple-500 mr-2" />
          Fase 3: Elementos Digitales
        </h3>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Cada componente fue modelado con precisión considerando sus características 
          físicas y funcionales:
        </p>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-cyan-50 dark:bg-cyan-900/30 rounded-lg">
            <Droplets className="w-12 h-12 text-cyan-500 mx-auto mb-2" />
            <p className="font-medium text-gray-800 dark:text-gray-200">Tanque</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">500L cilíndrico</p>
          </div>
          <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
            <Activity className="w-12 h-12 text-purple-500 mx-auto mb-2" />
            <p className="font-medium text-gray-800 dark:text-gray-200">Sensor</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">HC-SR04</p>
          </div>
          <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/30 rounded-lg">
            <Settings className="w-12 h-12 text-orange-500 mx-auto mb-2" />
            <p className="font-medium text-gray-800 dark:text-gray-200">Válvula</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Solenoide</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComponentsSection;