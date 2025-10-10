import React, { useMemo } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const TrendsChart = ({ systems = [] }) => {
  // Generar datos simulados de tendencias (en un sistema real vendrían de la API)
  const trendData = useMemo(() => {
    const now = new Date();
    const data = [];
    
    // Generar datos de los últimos 7 días
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dayName = date.toLocaleDateString('es-ES', { weekday: 'short' });
      
      // Simular niveles promedio por día
      const avgLevel = Math.max(20, Math.min(95, 60 + Math.sin(i) * 20 + Math.random() * 10 - 5));
      const trend = i === 6 ? 'stable' : 
                   avgLevel > data[data.length - 1]?.level ? 'up' : 
                   avgLevel < data[data.length - 1]?.level ? 'down' : 'stable';
      
      data.push({
        day: dayName,
        level: Math.round(avgLevel),
        trend,
        date: date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })
      });
    }
    
    return data;
  }, [systems]);

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const maxLevel = Math.max(...trendData.map(d => d.level));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          Tendencias de Nivel (Últimos 7 días)
        </h3>
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <TrendingUp className="h-4 w-4 text-green-500" />
          <span>Promedio: {Math.round(trendData.reduce((acc, d) => acc + d.level, 0) / trendData.length)}%</span>
        </div>
      </div>

      {/* Gráfico de barras */}
      <div className="space-y-3">
        {trendData.map((day, index) => (
          <div key={index} className="flex items-center gap-4">
            <div className="w-12 text-xs text-gray-600 dark:text-gray-400">
              {day.day}
            </div>
            <div className="flex-1 flex items-center gap-2">
              <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 relative">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    day.level > 80 ? 'bg-green-500' :
                    day.level > 50 ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}
                  style={{ width: `${(day.level / maxLevel) * 100}%` }}
                />
              </div>
              <div className="flex items-center gap-1 w-16">
                <span className={`text-sm font-medium ${getTrendColor(day.trend)}`}>
                  {day.level}%
                </span>
                {getTrendIcon(day.trend)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Leyenda */}
      <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span>Óptimo (80-100%)</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <span>Normal (50-80%)</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <span>Bajo (0-50%)</span>
        </div>
      </div>
    </div>
  );
};

export default TrendsChart;
