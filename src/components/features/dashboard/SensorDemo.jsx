import React, { useState, useEffect, useCallback } from 'react';
import { Activity, Zap, Target, Gauge } from 'lucide-react';

const SensorDemo = () => {
  const [isActive, setIsActive] = useState(false);
  const [distance, setDistance] = useState(35);
  const [targetDistance, setTargetDistance] = useState(35);
  const [isMeasuring, setIsMeasuring] = useState(false);
  const [measurementCount, setMeasurementCount] = useState(0);
  const [soundWaves, setSoundWaves] = useState([]);
  // const animationRef = useRef(null); // No se usa actualmente

  // Simular medición ultrasónica
  const simulateMeasurement = useCallback(() => {
    if (isMeasuring) return;
    
    setIsMeasuring(true);
    setMeasurementCount(prev => prev + 1);
    
    // Crear ondas de sonido animadas
    const newWave = {
      id: Date.now(),
      startTime: Date.now(),
      distance: targetDistance
    };
    setSoundWaves(prev => [...prev, newWave]);
    
    // Simular tiempo de vuelo
    setTimeout(() => {
      const measuredDistance = targetDistance + (Math.random() - 0.5) * 2; // ±1cm de variación
      setDistance(measuredDistance);
      setIsMeasuring(false);
      
      // Remover onda después de 2 segundos
      setTimeout(() => {
        setSoundWaves(prev => prev.filter(wave => wave.id !== newWave.id));
      }, 2000);
    }, 100 + (targetDistance * 0.6)); // Simular velocidad del sonido
  }, [isMeasuring, targetDistance]);

  // Auto-medición cada 2 segundos cuando está activo
  useEffect(() => {
    if (!isActive) return;
    
    const interval = setInterval(simulateMeasurement, 2000);
    return () => clearInterval(interval);
  }, [isActive, simulateMeasurement]);

  const handleStartStop = () => {
    if (isActive) {
      setIsActive(false);
      setSoundWaves([]);
    } else {
      setIsActive(true);
      simulateMeasurement();
    }
  };

  const calculateLevel = (dist) => {
    const tankHeight = 50; // cm
    const maxDistance = tankHeight;
    const level = Math.max(0, Math.min(100, 100 - (dist / maxDistance * 100)));
    return level;
  };

  const level = calculateLevel(distance);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6 flex items-center">
        <Activity className="w-6 h-6 text-purple-600 mr-3" />
        🎮 Demostración Interactiva - Sensor HC-SR04
      </h3>
      
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Visualización del Sensor */}
        <div className="space-y-6">
          {/* Tanque con sensor */}
          <div className="relative bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-xl p-6 border border-blue-200 dark:border-blue-700">
            <div className="relative h-80 bg-gradient-to-b from-sky-100 to-blue-200 rounded-lg border-2 border-blue-300 overflow-hidden">
              {/* Tanque */}
              <div className="absolute inset-0">
                {/* Agua con efectos mejorados */}
                <div 
                  className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-800 via-blue-600 to-cyan-400 transition-all duration-1500 ease-out"
                  style={{ height: `${level}%` }}
                >
                  {/* Ondas en la superficie mejoradas */}
                  <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-t from-blue-500 to-transparent opacity-70">
                    <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-transparent via-white to-transparent opacity-60 animate-pulse"></div>
                    <div className="absolute top-1 left-0 right-0 h-2 bg-gradient-to-r from-cyan-200 via-white to-cyan-200 opacity-40 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                  </div>
                  
                  {/* Efectos de burbujas */}
                  {level > 20 && (
                    <div className="absolute inset-0">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className="absolute w-1 h-1 bg-white rounded-full opacity-60 animate-ping"
                          style={{
                            left: `${20 + i * 15}%`,
                            bottom: `${10 + i * 5}%`,
                            animationDelay: `${i * 0.8}s`,
                            animationDuration: '3s'
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Sensor montado en la parte superior */}
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gray-800 w-12 h-8 rounded-lg flex items-center justify-center shadow-lg">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                    </div>
                  </div>
                  <div className="text-center mt-1">
                    <span className="text-xs font-semibold text-gray-700 bg-white px-2 py-1 rounded">HC-SR04</span>
                  </div>
                </div>

                {/* Ondas de sonido */}
                {soundWaves.map((wave) => {
                  const elapsed = Date.now() - wave.startTime;
                  const progress = Math.min(elapsed / 2000, 1);
                  const waveY = 20 + (progress * (wave.distance * 4)); // Escalar para visualización
                  const opacity = 1 - progress;
                  const scale = 0.5 + (progress * 1.5);
                  
                  return (
                    <div
                      key={wave.id}
                      className="absolute left-1/2 transform -translate-x-1/2 transition-all duration-100"
                      style={{
                        top: `${waveY}px`,
                        opacity,
                        transform: `translateX(-50%) scale(${scale})`
                      }}
                    >
                      <div className="w-8 h-8 border-2 border-yellow-400 rounded-full animate-ping"></div>
                    </div>
                  );
                })}

                {/* Línea de medición */}
                {isMeasuring && (
                  <div className="absolute left-1/2 top-12 transform -translate-x-1/2">
                    <div className="w-0.5 bg-red-500 animate-pulse" style={{ height: `${distance * 4}px` }}></div>
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    </div>
                  </div>
                )}

                {/* Indicador de nivel */}
                <div className="absolute right-2 top-4 bg-white/90 backdrop-blur rounded-lg p-2 shadow-lg">
                  <div className="text-xs font-semibold text-gray-700">Nivel</div>
                  <div className="text-lg font-bold text-blue-600">{level.toFixed(1)}%</div>
                </div>
              </div>
            </div>

            {/* Información del tanque */}
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Tanque de 500L • Altura: 50cm • Capacidad actual: {(level * 5).toFixed(1)}L
              </p>
            </div>
          </div>

          {/* Controles */}
          <div className="space-y-4">
            <div className="flex gap-3 justify-center">
              <button
                onClick={handleStartStop}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  isActive
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-green-500 text-white hover:bg-green-600'
                }`}
              >
                <Zap className="w-4 h-4" />
                {isActive ? 'Detener' : 'Iniciar'} Sensor
              </button>
              
              <button
                onClick={simulateMeasurement}
                disabled={isMeasuring}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Target className="w-4 h-4" />
                Medir Ahora
              </button>
            </div>

            {/* Control de distancia objetivo */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Distancia objetivo: {targetDistance.toFixed(1)} cm
              </label>
              <input
                type="range"
                min="5"
                max="45"
                step="0.5"
                value={targetDistance}
                onChange={(e) => setTargetDistance(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Estadísticas */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                <div className="font-semibold text-gray-700 dark:text-gray-300">Mediciones</div>
                <div className="text-lg font-bold text-blue-600">{measurementCount}</div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                <div className="font-semibold text-gray-700 dark:text-gray-300">Estado</div>
                <div className={`text-lg font-bold ${isActive ? 'text-green-600' : 'text-gray-500'}`}>
                  {isActive ? 'Activo' : 'Inactivo'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Información técnica */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/30 dark:to-indigo-900/30 rounded-lg p-4 border border-purple-200 dark:border-purple-700">
            <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center">
              <Gauge className="w-5 h-5 text-purple-600 mr-2" />
              📊 Datos de Medición
            </h4>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Distancia medida:</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200">{distance.toFixed(1)} cm</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Nivel calculado:</span>
                <span className="font-semibold text-blue-600">{level.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Tiempo de vuelo:</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200">{((distance * 2) / 343 * 1000).toFixed(1)} μs</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Precisión:</span>
                <span className="font-semibold text-green-600">±2 mm</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/30 rounded-lg p-4 border border-amber-200 dark:border-amber-700">
            <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center">
              🔬 Principio de Funcionamiento
            </h4>
            <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <div className="flex items-start">
                <span className="w-2 h-2 bg-amber-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span><strong>Emisión:</strong> El sensor emite ondas ultrasónicas a 40kHz</span>
              </div>
              <div className="flex items-start">
                <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span><strong>Reflexión:</strong> Las ondas rebotan en la superficie del agua</span>
              </div>
              <div className="flex items-start">
                <span className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span><strong>Recepción:</strong> El sensor detecta el eco de retorno</span>
              </div>
              <div className="flex items-start">
                <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span><strong>Cálculo:</strong> Distancia = (Velocidad × Tiempo) ÷ 2</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 rounded-lg p-4 border border-green-200 dark:border-green-700">
            <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center">
              ⚡ Características del Sensor
            </h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">Rango:</span>
                <p className="text-gray-600 dark:text-gray-400">2cm - 4m</p>
              </div>
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">Precisión:</span>
                <p className="text-gray-600 dark:text-gray-400">±3mm</p>
              </div>
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">Frecuencia:</span>
                <p className="text-gray-600 dark:text-gray-400">40kHz</p>
              </div>
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">Voltaje:</span>
                <p className="text-gray-600 dark:text-gray-400">5V DC</p>
              </div>
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">Consumo:</span>
                <p className="text-gray-600 dark:text-gray-400">15mA</p>
              </div>
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">Ángulo:</span>
                <p className="text-gray-600 dark:text-gray-400">15°</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SensorDemo;
