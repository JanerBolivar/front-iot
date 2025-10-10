import React, { useState, useEffect } from 'react';
import { Droplets, Play, Pause, RotateCcw } from 'lucide-react';
import TankViz from '../devices/TankViz';

const TankSection = () => {
  // Estados para la demostración interactiva
  const [waterLevel, setWaterLevel] = useState(60);
  const [valveOpen, setValveOpen] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(1000);

  // Efecto para animar el llenado automático
  useEffect(() => {
    if (!isAnimating) return;

    const interval = setInterval(() => {
      setWaterLevel(prev => {
        const newLevel = prev + (valveOpen ? 2 : -1);
        if (newLevel >= 100) {
          setValveOpen(false);
          return 100;
        }
        if (newLevel <= 0) {
          setValveOpen(true);
          return 0;
        }
        return newLevel;
      });
    }, animationSpeed);

    return () => clearInterval(interval);
  }, [isAnimating, valveOpen, animationSpeed]);

  const handleStartAnimation = () => {
    setIsAnimating(true);
  };

  const handleStopAnimation = () => {
    setIsAnimating(false);
  };

  const handleReset = () => {
    setIsAnimating(false);
    setWaterLevel(60);
    setValveOpen(true);
  };

  const handleManualLevelChange = (newLevel) => {
    setWaterLevel(newLevel);
  };

  const handleValveToggle = () => {
    setValveOpen(!valveOpen);
  };

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-br from-cyan-50 to-blue-100 dark:from-cyan-900/30 dark:to-blue-900/30 rounded-2xl p-8 border border-cyan-200 dark:border-cyan-700">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
          <Droplets className="w-8 h-8 text-cyan-600 mr-3" />
          Tanque de Almacenamiento 500L
        </h2>
        <p className="text-gray-700 dark:text-gray-300 text-lg">
          Recipiente cilíndrico vertical de polietileno de alta densidad para 
          almacenamiento de agua.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Especificaciones Técnicas
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <span className="font-medium text-gray-700 dark:text-gray-300">Capacidad:</span>
              <span className="text-gray-800 dark:text-gray-200">500 Litros</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <span className="font-medium text-gray-700 dark:text-gray-300">Diámetro Inferior:</span>
              <span className="text-gray-800 dark:text-gray-200">0.65 m</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <span className="font-medium text-gray-700 dark:text-gray-300">Diámetro Superior:</span>
              <span className="text-gray-800 dark:text-gray-200">1.02 m</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <span className="font-medium text-gray-700 dark:text-gray-300">Altura:</span>
              <span className="text-gray-800 dark:text-gray-200">1.15 m</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <span className="font-medium text-gray-700 dark:text-gray-300">Material:</span>
              <span className="text-gray-800 dark:text-gray-200">PEAD</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Características del Diseño
          </h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="bg-cyan-500 w-3 h-3 rounded-full mt-2"></div>
              <div>
                <p className="font-medium text-gray-800 dark:text-gray-200">Forma Cilíndrica Vertical</p>
                <p className="text-gray-600 dark:text-gray-400">
                  Diseño optimizado basado en tanques comerciales estándar
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-blue-500 w-3 h-3 rounded-full mt-2"></div>
              <div>
                <p className="font-medium text-gray-800 dark:text-gray-200">Superficie Translúcida</p>
                <p className="text-gray-600 dark:text-gray-400">
                  Simula polietileno de alta densidad con texturas realistas
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-indigo-500 w-3 h-3 rounded-full mt-2"></div>
              <div>
                <p className="font-medium text-gray-800 dark:text-gray-200">Tapa Superior Removible</p>
                <p className="text-gray-600 dark:text-gray-400">Acceso para mantenimiento y limpieza</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-purple-500 w-3 h-3 rounded-full mt-2"></div>
              <div>
                <p className="font-medium text-gray-800 dark:text-gray-200">Orificios de Conexión</p>
                <p className="text-gray-600 dark:text-gray-400">Entrada y salida para válvulas y sensores</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Demostración Interactiva del Tanque */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6">
          🎮 Demostración Interactiva - Animaciones Mejoradas
        </h3>
        
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Visualización del Tanque */}
          <div className="space-y-4">
            <TankViz
              level={waterLevel}
              capacityLiters={500}
              variant="rect"
              indicator="chip"
              valveOpen={valveOpen}
              valveSpin={isAnimating}
              showHeader={true}
              showPercent={true}
              className="mx-auto"
            />
            
            {/* Controles de animación */}
            <div className="space-y-4">
              <div className="flex gap-2 justify-center">
                <button
                  onClick={handleStartAnimation}
                  disabled={isAnimating}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Play className="w-4 h-4" />
                  Iniciar
                </button>
                <button
                  onClick={handleStopAnimation}
                  disabled={!isAnimating}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Pause className="w-4 h-4" />
                  Pausar
                </button>
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  Resetear
                </button>
              </div>

              {/* Control manual del nivel */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Nivel de agua: {waterLevel}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={waterLevel}
                  onChange={(e) => handleManualLevelChange(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Control de válvula */}
              <div className="flex items-center justify-center gap-4">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Válvula:</span>
                <button
                  onClick={handleValveToggle}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    valveOpen
                      ? 'bg-green-100 text-green-800 border border-green-300'
                      : 'bg-red-100 text-red-800 border border-red-300'
                  }`}
                >
                  {valveOpen ? 'Abierta' : 'Cerrada'}
                </button>
              </div>

              {/* Control de velocidad */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Velocidad de animación: {animationSpeed}ms
                </label>
                <input
                  type="range"
                  min="200"
                  max="2000"
                  step="100"
                  value={animationSpeed}
                  onChange={(e) => setAnimationSpeed(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Descripción de las mejoras */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
              <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center">
                <Droplets className="w-5 h-5 text-blue-600 mr-2" />
                🎨 Mejoras en las Animaciones
              </h4>
              <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span><strong>Ondas Multi-capa:</strong> 5 capas de ondas con diferentes frecuencias y opacidades para un efecto más realista</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-cyan-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span><strong>Burbujas Mejoradas:</strong> 12 burbujas con diferentes tamaños, velocidades y movimientos flotantes</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-indigo-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span><strong>Efectos de Flujo:</strong> Animaciones de chorros de agua cuando la válvula está abierta</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span><strong>Gradientes Realistas:</strong> Múltiples gradientes para profundidad, reflexión y brillo</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-pink-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span><strong>Transiciones Suaves:</strong> Animaciones fluidas para llenado, vaciado y cambios de estado</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 rounded-lg p-4 border border-green-200 dark:border-green-700">
              <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center">
                ⚡ Controles Interactivos
              </h4>
              <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span><strong>Animación Automática:</strong> Llena y vacía el tanque automáticamente</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span><strong>Control Manual:</strong> Ajusta el nivel de agua con el deslizador</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-teal-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span><strong>Control de Válvula:</strong> Abre y cierra la válvula para ver los efectos de flujo</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-lime-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span><strong>Velocidad Ajustable:</strong> Controla la velocidad de las animaciones</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/30 rounded-lg p-4 border border-amber-200 dark:border-amber-700">
              <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center">
                🔧 Detalles Técnicos
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Ondas:</span>
                  <p className="text-gray-600 dark:text-gray-400">5 capas con frecuencias variables</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Burbujas:</span>
                  <p className="text-gray-600 dark:text-gray-400">12 burbujas con 3 tamaños</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Gradientes:</span>
                  <p className="text-gray-600 dark:text-gray-400">3 gradientes especializados</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Animaciones:</span>
                  <p className="text-gray-600 dark:text-gray-400">15+ keyframes diferentes</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Demostración de Variantes del Tanque */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6">
          🎨 Variantes del Tanque con Animaciones Mejoradas
        </h3>
        
        <div className="grid md:grid-cols-3 gap-6">
          {/* Variante Rectangular */}
          <div className="text-center space-y-3">
            <TankViz
              level={75}
              capacityLiters={500}
              variant="rect"
              indicator="chip"
              valveOpen={true}
              valveSpin={false}
              showHeader={false}
              showPercent={true}
              className="mx-auto"
            />
            <h4 className="font-medium text-gray-800 dark:text-gray-200">Rectangular</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">Forma estándar con bordes redondeados</p>
          </div>

          {/* Variante Drum */}
          <div className="text-center space-y-3">
            <TankViz
              level={45}
              capacityLiters={500}
              variant="drum"
              indicator="chip"
              valveOpen={false}
              valveSpin={false}
              showHeader={false}
              showPercent={true}
              className="mx-auto"
            />
            <h4 className="font-medium text-gray-800 dark:text-gray-200">Tambor</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">Diseño más robusto y cilíndrico</p>
          </div>

          {/* Variante Cylinder */}
          <div className="text-center space-y-3">
            <TankViz
              level={85}
              capacityLiters={500}
              variant="cyl"
              indicator="chip"
              valveOpen={true}
              valveSpin={true}
              showHeader={false}
              showPercent={true}
              className="mx-auto"
            />
            <h4 className="font-medium text-gray-800 dark:text-gray-200">Cilíndrico</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">Forma completamente cilíndrica</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Proceso de Modelado</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="bg-cyan-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl font-bold text-cyan-600">1</span>
            </div>
            <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Diseño Base</h4>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Modelado del tanque sin texturas siguiendo dimensiones reales
            </p>
          </div>
          <div className="text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl font-bold text-blue-600">2</span>
            </div>
            <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Texturización</h4>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Aplicación de materiales y etiquetas comerciales
            </p>
          </div>
          <div className="text-center">
            <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl font-bold text-indigo-600">3</span>
            </div>
            <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Tapa y Detalles</h4>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Diseño de tapa removible y detalles estructurales
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TankSection;