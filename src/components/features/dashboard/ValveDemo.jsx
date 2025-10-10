import React, { useState, useEffect } from 'react';
import { Wrench, Power, Zap, Settings, Gauge, Droplets } from 'lucide-react';

const ValveDemo = () => {
  const [valveOpen, setValveOpen] = useState(false);
  // const [isAnimating, setIsAnimating] = useState(false); // No se usa actualmente
  const [waterFlow, setWaterFlow] = useState(0);
  const [pressure, setPressure] = useState(0);
  const [powerConsumption, setPowerConsumption] = useState(0);
  const [operationCount, setOperationCount] = useState(0);
  const [autoMode, setAutoMode] = useState(false);
  const [targetLevel, setTargetLevel] = useState(60);

  // Simular efectos de la válvula
  useEffect(() => {
    if (valveOpen) {
      // setIsAnimating(true); // Variable no utilizada
      setWaterFlow(85);
      setPressure(2.5);
      setPowerConsumption(12); // Watts
      
      // Simular flujo de agua
      const interval = setInterval(() => {
        setWaterFlow(85 + (Math.random() - 0.5) * 10);
        setPressure(2.5 + (Math.random() - 0.5) * 0.3);
      }, 500);
      
      return () => clearInterval(interval);
    } else {
      // Variable isAnimating no utilizada
      setWaterFlow(0);
      setPressure(0);
      setPowerConsumption(0);
    }
  }, [valveOpen]);

  // Modo automático
  useEffect(() => {
    if (!autoMode) return;
    
    const interval = setInterval(() => {
      const currentLevel = 50 + Math.sin(Date.now() / 10000) * 20; // Simular nivel variable
      
      if (currentLevel < targetLevel - 5 && !valveOpen) {
        setValveOpen(true);
        setOperationCount(prev => prev + 1);
      } else if (currentLevel > targetLevel + 5 && valveOpen) {
        setValveOpen(false);
        setOperationCount(prev => prev + 1);
      }
    }, 2000);
    
    return () => clearInterval(interval);
  }, [autoMode, targetLevel, valveOpen]);

  const handleToggleValve = () => {
    setValveOpen(!valveOpen);
    setOperationCount(prev => prev + 1);
  };

  const handleAutoMode = () => {
    setAutoMode(!autoMode);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6 flex items-center">
        <Wrench className="w-6 h-6 text-green-600 mr-3" />
        🎮 Demostración Interactiva - Válvula Solenoide
      </h3>
      
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Visualización de la Válvula */}
        <div className="space-y-6">
          {/* Válvula 3D */}
          <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl p-8 border border-gray-200 dark:border-gray-600">
            <div className="relative h-64 flex items-center justify-center">
              {/* Válvula principal */}
              <div className="relative">
                {/* Cuerpo de la válvula */}
                <div className="w-24 h-16 bg-gradient-to-br from-gray-300 to-gray-400 rounded-lg shadow-lg border-2 border-gray-500 flex items-center justify-center">
                  {/* Bobina solenoide */}
                  <div className="w-16 h-12 bg-gradient-to-br from-blue-300 to-blue-400 rounded-lg border border-blue-500 relative overflow-hidden">
                    {/* Líneas de la bobina */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      {[...Array(8)].map((_, i) => (
                        <div
                          key={i}
                          className="absolute w-full h-0.5 bg-blue-600 opacity-60"
                          style={{ top: `${i * 1.5 + 1}px` }}
                        />
                      ))}
                    </div>
                    
                    {/* Núcleo móvil */}
                    <div 
                      className={`absolute w-4 h-8 bg-gradient-to-b from-yellow-400 to-yellow-500 rounded-sm border border-yellow-600 transition-all duration-300 ${
                        valveOpen ? 'left-1 top-2' : 'right-1 top-2'
                      }`}
                    />
                  </div>
                </div>

                {/* Tuberías */}
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-8">
                  <div className="w-16 h-4 bg-gray-400 rounded-full border-2 border-gray-500"></div>
                </div>
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-8">
                  <div className="w-16 h-4 bg-gray-400 rounded-full border-2 border-gray-500"></div>
                </div>

                {/* Flujo de agua mejorado */}
                {valveOpen && (
                  <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-16">
                    <div className="flex space-x-1">
                      {[...Array(8)].map((_, i) => (
                        <div
                          key={i}
                          className="w-1.5 h-4 bg-gradient-to-b from-cyan-300 to-blue-500 rounded-full animate-pulse shadow-sm"
                          style={{ 
                            animationDelay: `${i * 0.1}s`,
                            animationDuration: '1.2s'
                          }}
                        />
                      ))}
                    </div>
                    {/* Efectos de goteo y salpicadura */}
                    <div className="absolute -bottom-3 left-2">
                      {[...Array(4)].map((_, i) => (
                        <div
                          key={i}
                          className="absolute w-1 h-1 bg-blue-400 rounded-full animate-ping"
                          style={{ 
                            left: `${i * 6}px`,
                            animationDelay: `${i * 0.2}s`,
                            animationDuration: '1.8s'
                          }}
                        />
                      ))}
                    </div>
                    {/* Líneas de flujo */}
                    <div className="absolute -left-8 top-1/2 transform -translate-y-1/2">
                      {[...Array(3)].map((_, i) => (
                        <div
                          key={i}
                          className="absolute w-12 h-0.5 bg-gradient-to-r from-blue-400 to-transparent animate-pulse"
                          style={{ 
                            top: `${i * 4 - 4}px`,
                            animationDelay: `${i * 0.3}s`,
                            animationDuration: '2s'
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* LED indicador mejorado */}
                <div className="absolute -top-2 -right-2">
                  <div 
                    className={`w-5 h-5 rounded-full border-2 border-white shadow-lg transition-all duration-500 ${
                      valveOpen 
                        ? 'bg-green-400 animate-pulse shadow-green-400/50 shadow-lg' 
                        : 'bg-red-400 shadow-red-400/50 shadow-lg'
                    }`}
                    style={{
                      boxShadow: valveOpen 
                        ? '0 0 20px rgba(34, 197, 94, 0.8), inset 0 0 10px rgba(255, 255, 255, 0.3)' 
                        : '0 0 20px rgba(239, 68, 68, 0.8), inset 0 0 10px rgba(255, 255, 255, 0.3)'
                    }}
                  />
                  {/* Efecto de resplandor */}
                  <div 
                    className={`absolute inset-0 rounded-full ${
                      valveOpen ? 'bg-green-400 animate-ping' : 'bg-red-400 animate-ping'
                    }`}
                    style={{ 
                      animationDuration: '2s',
                      opacity: 0.3
                    }}
                  />
                </div>

                {/* Efectos de corriente */}
                {valveOpen && (
                  <div className="absolute inset-0 pointer-events-none">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-2 h-2 bg-blue-400 rounded-full opacity-60 animate-ping"
                        style={{
                          left: `${20 + i * 10}%`,
                          top: `${30 + i * 20}%`,
                          animationDelay: `${i * 0.3}s`
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Etiquetas */}
              <div className="absolute top-2 left-2 bg-white/90 dark:bg-gray-700/90 backdrop-blur rounded-lg p-2 shadow-lg">
                <div className="text-xs font-semibold text-gray-700 dark:text-gray-200">ENTRADA</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Presión: {pressure.toFixed(1)} bar</div>
              </div>
              
              <div className="absolute top-2 right-2 bg-white/90 dark:bg-gray-700/90 backdrop-blur rounded-lg p-2 shadow-lg">
                <div className="text-xs font-semibold text-gray-700 dark:text-gray-200">SALIDA</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Flujo: {waterFlow.toFixed(0)} L/min</div>
              </div>
            </div>

            {/* Estado de la válvula */}
            <div className="mt-4 text-center">
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold ${
                valveOpen 
                  ? 'bg-green-100 text-green-800 border border-green-300' 
                  : 'bg-red-100 text-red-800 border border-red-300'
              }`}>
                <div className={`w-3 h-3 rounded-full ${valveOpen ? 'bg-green-500' : 'bg-red-500'}`}></div>
                {valveOpen ? 'VÁLVULA ABIERTA' : 'VÁLVULA CERRADA'}
              </div>
            </div>
          </div>

          {/* Controles */}
          <div className="space-y-4">
            <div className="flex gap-3 justify-center">
              <button
                onClick={handleToggleValve}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  valveOpen
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-green-500 text-white hover:bg-green-600'
                }`}
              >
                <Power className="w-4 h-4" />
                {valveOpen ? 'Cerrar' : 'Abrir'} Válvula
              </button>
              
              <button
                onClick={handleAutoMode}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  autoMode
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : 'bg-gray-500 text-white hover:bg-gray-600'
                }`}
              >
                <Settings className="w-4 h-4" />
                {autoMode ? 'Auto ON' : 'Auto OFF'}
              </button>
            </div>

            {/* Control de nivel objetivo (solo en modo auto) */}
            {autoMode && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Nivel objetivo: {targetLevel}%
                </label>
                <input
                  type="range"
                  min="20"
                  max="80"
                  step="5"
                  value={targetLevel}
                  onChange={(e) => setTargetLevel(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            )}

            {/* Estadísticas */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                <div className="font-semibold text-gray-700 dark:text-gray-300">Operaciones</div>
                <div className="text-lg font-bold text-blue-600">{operationCount}</div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                <div className="font-semibold text-gray-700 dark:text-gray-300">Consumo</div>
                <div className="text-lg font-bold text-orange-600">{powerConsumption}W</div>
              </div>
            </div>
          </div>
        </div>

        {/* Información técnica */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 rounded-lg p-4 border border-green-200 dark:border-green-700">
            <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center">
              <Zap className="w-5 h-5 text-green-600 mr-2" />
              📊 Datos de Operación
            </h4>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Estado:</span>
                <span className={`font-semibold ${valveOpen ? 'text-green-600' : 'text-red-600'}`}>
                  {valveOpen ? 'Abierta' : 'Cerrada'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Flujo de agua:</span>
                <span className="font-semibold text-blue-600">{waterFlow.toFixed(1)} L/min</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Presión:</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200">{pressure.toFixed(1)} bar</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Consumo eléctrico:</span>
                <span className="font-semibold text-orange-600">{powerConsumption}W</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
            <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center">
              🔧 Principio de Funcionamiento
            </h4>
            <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <div className="flex items-start">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span><strong>Bobina:</strong> Al aplicar corriente se crea un campo magnético</span>
              </div>
              <div className="flex items-start">
                <span className="w-2 h-2 bg-cyan-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span><strong>Núcleo:</strong> El núcleo de hierro se mueve por atracción magnética</span>
              </div>
              <div className="flex items-start">
                <span className="w-2 h-2 bg-indigo-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span><strong>Apertura:</strong> El movimiento del núcleo abre el paso del agua</span>
              </div>
              <div className="flex items-start">
                <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span><strong>Cierre:</strong> Sin corriente, el resorte cierra la válvula</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/30 rounded-lg p-4 border border-amber-200 dark:border-amber-700">
            <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center">
              ⚡ Especificaciones Técnicas
            </h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">Voltaje:</span>
                <p className="text-gray-600 dark:text-gray-400">12V DC</p>
              </div>
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">Corriente:</span>
                <p className="text-gray-600 dark:text-gray-400">1A (12W)</p>
              </div>
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">Presión:</span>
                <p className="text-gray-600 dark:text-gray-400">0-10 bar</p>
              </div>
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">Caudal:</span>
                <p className="text-gray-600 dark:text-gray-400">0-100 L/min</p>
              </div>
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">Tiempo respuesta:</span>
                <p className="text-gray-600 dark:text-gray-400">&lt;1 seg</p>
              </div>
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">Conexión:</span>
                <p className="text-gray-600 dark:text-gray-400">1/2" NPT</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/30 dark:to-pink-900/30 rounded-lg p-4 border border-red-200 dark:border-red-700">
            <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center">
              ⚠️ Ventajas y Consideraciones
            </h4>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium text-green-600">✓ Ventajas:</span>
                <ul className="text-gray-700 dark:text-gray-300 ml-4 mt-1 space-y-1">
                  <li>• Control preciso y rápido</li>
                  <li>• Funcionamiento silencioso</li>
                  <li>• Bajo mantenimiento</li>
                  <li>• Compatible con sistemas automatizados</li>
                </ul>
              </div>
              <div>
                <span className="font-medium text-orange-600">⚠ Consideraciones:</span>
                <ul className="text-gray-700 dark:text-gray-300 ml-4 mt-1 space-y-1">
                  <li>• Requiere fuente de alimentación</li>
                  <li>• Consumo eléctrico continuo</li>
                  <li>• Sensible a sobrepresión</li>
                  <li>• Puede generar calor en uso prolongado</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ValveDemo;
