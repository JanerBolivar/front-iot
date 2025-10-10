// src/components/DevicesSection/TankViz.jsx
import React, { useMemo } from "react";
import RealisticValve from "./RealisticValve";

/**
 * TankViz - Versión simplificada y funcional
 * - level: 0..100 (%)
 * - capacityLiters: número (ej. 500)  -> usado para mostrar litros
 * - variant: "rect" | "drum" | "cyl"
 * - indicator: "chip" | "bar" | "none"
 * - valveOpen: true/false
 * - valveSpin: true/false => anima un "vaivén" corto
 * - showHeader: muestra el título interno "Tanque XXX L"
 * - showPercent: muestra %/litros arriba a la derecha
 * - className: estilos extra
 */
export default function TankViz({
  level = 60,
  capacityLiters = 500,
  variant = "rect",
  indicator = "chip",
  valveOpen = true,
  valveSpin = false,
  showHeader = false,
  showPercent = true,
  className = "",
}) {
  const rid = `tank-${Math.random().toString(36).slice(2)}`;
  const clipId = `${rid}-clip`;
  const gradId = `${rid}-grad`;

  const W = 320;  // Aumentado de 260 a 320
  const H = 220;  // Aumentado de 180 a 220
  const viewBox = `0 0 ${W} ${H}`;

  const shape = useMemo(() => {
    switch (variant) {
      case "square": {
        const x = 60, y = 35, w = 200, h = 200;
        return {
          content: { x, y, w, h },
          clipPath: <rect x={x} y={y} width={w} height={h} />,
          outline: <rect x={x} y={y} width={w} height={h} stroke="currentColor" strokeWidth="3" fill="none" className="text-gray-700 dark:text-gray-300" />,
        };
      }
      default: { // "rect" - Rectangular
        const x = 40, y = 25, w = 240, h = 170;
        return {
          content: { x, y, w, h },
          clipPath: <rect x={x} y={y} width={w} height={h} />,
          outline: <rect x={x} y={y} width={w} height={h} stroke="currentColor" strokeWidth="3" fill="none" className="text-gray-700 dark:text-gray-300" />,
        };
      }
    }
  }, [variant]);

  const waterHeight = useMemo(() => {
    const { h } = shape.content;
    return (level / 100) * h;
  }, [level, shape.content]);

  // const valveColor = valveOpen ? "#22c55e" : "#ef4444"; // No se usa actualmente

  return (
    <div className={`rounded-2xl border bg-white dark:bg-gray-800 p-4 shadow-sm ${className}`}>
      {/* Estilos mejorados con animaciones fluidas */}
      <style>{`
        .valve-wiggle {
          animation: valveWiggle 1.5s ease-in-out infinite;
        }
        
        .valve-open {
          animation: valvePulse 2s ease-in-out infinite;
        }
        
        .valve-closed {
          animation: valvePulseRed 2s ease-in-out infinite;
        }

        @keyframes valveWiggle {
          0% { transform: translateX(0) rotate(0); }
          25% { transform: translateX(4px) rotate(5deg); }
          50% { transform: translateX(8px) rotate(10deg); }
          75% { transform: translateX(4px) rotate(5deg); }
          100% { transform: translateX(0) rotate(0); }
        }

        /* Animaciones de válvula realistas */
        @keyframes rotateValveOpen {
          0% { transform: rotate(0deg); }
          20% { transform: rotate(-5deg); }
          100% { transform: rotate(90deg); }
        }

        @keyframes rotateValveClose {
          0% { transform: rotate(90deg); }
          20% { transform: rotate(95deg); }
          100% { transform: rotate(0deg); }
        }

        @keyframes glowOpen {
          0% { filter: drop-shadow(0 0 5px rgba(34, 197, 94, 0)); }
          100% { filter: drop-shadow(0 0 20px rgba(34, 197, 94, 0.6)); }
        }

        @keyframes glowClose {
          0% { filter: drop-shadow(0 0 20px rgba(34, 197, 94, 0.6)); }
          100% { filter: drop-shadow(0 0 5px rgba(239, 68, 68, 0)); }
        }

        .valve-rotating-open {
          animation: rotateValveOpen 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }

        .valve-rotating-close {
          animation: rotateValveClose 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }

        .glow-opening {
          animation: glowOpen 0.8s ease-out forwards 0.4s;
        }

        .glow-closing {
          animation: glowClose 0.6s ease-in forwards;
        }

        @keyframes valvePulse {
          0%, 100% { 
            filter: drop-shadow(0 0 0 rgba(34, 197, 94, 0));
            box-shadow: 0 0 0 rgba(34, 197, 94, 0);
          }
          50% { 
            filter: drop-shadow(0 0 15px rgba(34, 197, 94, 0.9));
            box-shadow: 0 0 25px rgba(34, 197, 94, 0.7);
          }
        }

        @keyframes valvePulseRed {
          0%, 100% { 
            filter: drop-shadow(0 0 0 rgba(239, 68, 68, 0));
            box-shadow: 0 0 0 rgba(239, 68, 68, 0);
          }
          50% { 
            filter: drop-shadow(0 0 15px rgba(239, 68, 68, 0.9));
            box-shadow: 0 0 25px rgba(239, 68, 68, 0.7);
          }
        }

        /* === ANIMACIONES DE AGUA FLUIDAS === */
        .water-animation {
          animation: waterBob 4s ease-in-out infinite, waterFlow 6s linear infinite;
        }

        .water-surface {
          animation: surfaceWave 3s ease-in-out infinite;
        }

        .water-bubbles {
          animation: bubbleRise 4s ease-in-out infinite;
        }

        @keyframes waterBob {
          0%, 100% { 
            transform: translateY(0) scaleY(1); 
            opacity: 0.9;
          }
          25% { 
            transform: translateY(-2px) scaleY(1.02); 
            opacity: 1;
          }
          50% { 
            transform: translateY(-1px) scaleY(1.01); 
            opacity: 0.95;
          }
          75% { 
            transform: translateY(-3px) scaleY(1.03); 
            opacity: 1;
          }
        }

        @keyframes waterFlow {
          0% { 
            background-position: 0% 0%; 
          }
          100% { 
            background-position: 100% 0%; 
          }
        }

        @keyframes surfaceWave {
          0%, 100% { 
            transform: translateX(0) scaleY(1); 
            opacity: 0.8;
          }
          33% { 
            transform: translateX(-5px) scaleY(1.1); 
            opacity: 1;
          }
          66% { 
            transform: translateX(5px) scaleY(0.9); 
            opacity: 0.9;
          }
        }

        @keyframes bubbleRise {
          0% { 
            transform: translateY(0) scale(0.8); 
            opacity: 0.6;
          }
          50% { 
            transform: translateY(-8px) scale(1); 
            opacity: 0.8;
          }
          100% { 
            transform: translateY(-15px) scale(1.2); 
            opacity: 0;
          }
        }

        /* === ANIMACIÓN DE LLENADO === */
        .water-filling {
          animation: waterRise 2s ease-out;
        }

        @keyframes waterRise {
          0% { 
            transform: translateY(100%) scaleY(0); 
            opacity: 0;
          }
          50% { 
            transform: translateY(50%) scaleY(0.5); 
            opacity: 0.7;
          }
          100% { 
            transform: translateY(0%) scaleY(1); 
            opacity: 1;
          }
        }
      `}</style>

      <div className="text-center mb-2">
        {showHeader && <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Tanque {capacityLiters}L</h3>}
        {showPercent && (
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {level}% ({Math.round((level / 100) * capacityLiters)}L)
          </div>
        )}
          </div>

      <div className="relative">
        <svg width={W} height={H} viewBox={viewBox} className="mx-auto">
          <defs>
            {/* Gradiente principal del agua más realista */}
            <linearGradient id={gradId} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#87CEEB" stopOpacity="1" />
              <stop offset="15%" stopColor="#4682B4" stopOpacity="0.95" />
              <stop offset="35%" stopColor="#1E90FF" stopOpacity="0.9" />
              <stop offset="60%" stopColor="#0066CC" stopOpacity="0.85" />
              <stop offset="85%" stopColor="#003D82" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#002147" stopOpacity="0.95" />
            </linearGradient>

            {/* Gradiente de superficie con brillo */}
            <linearGradient id={`${gradId}-surface`} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
              <stop offset="20%" stopColor="#f0f8ff" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#e6f3ff" stopOpacity="0.6" />
              <stop offset="80%" stopColor="#cce7ff" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#99d6ff" stopOpacity="0.2" />
            </linearGradient>

            {/* Gradiente para burbujas */}
            <radialGradient id={`${gradId}-bubble`} cx="0.5" cy="0.5" r="0.5">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
              <stop offset="70%" stopColor="#e6f3ff" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#cce7ff" stopOpacity="0" />
            </radialGradient>
            
            <clipPath id={clipId}>
              {shape.clipPath}
            </clipPath>
          </defs>

          {/* Fondo del tanque - adaptado para modo oscuro */}
          <rect x={shape.content.x} y={shape.content.y} width={shape.content.w} height={shape.content.h} fill="currentColor" fillOpacity="0.05" className="text-gray-900 dark:text-gray-100" />
          
          {/* Agua con múltiples capas */}
          <g clipPath={`url(#${clipId})`}>
            {/* Capa principal del agua */}
            <rect 
              x={shape.content.x}
              y={shape.content.y + shape.content.h - waterHeight}
              width={shape.content.w}
              height={waterHeight}
              fill={`url(#${gradId})`} 
              className="water-animation"
            />
            
            {/* Capa de profundidad */}
            {level > 20 && (
            <rect 
                x={shape.content.x}
                y={shape.content.y + shape.content.h - waterHeight + 10}
                width={shape.content.w}
                height={waterHeight - 10}
                fill={`url(#${gradId})`}
                opacity="0.7"
              />
            )}
            
            {/* Superficie del agua con ondas */}
            {level > 5 && (
              <rect
                x={shape.content.x}
                y={shape.content.y + shape.content.h - waterHeight}
                width={shape.content.w}
                height="12"
                fill={`url(#${gradId}-surface)`}
                className="water-surface"
              />
            )}
            
            {/* Burbujas cuando hay agua */}
            {level > 30 && (
              <>
                {[...Array(6)].map((_, i) => (
                <circle
                    key={i}
                    cx={shape.content.x + 40 + (i * 35)}
                    cy={shape.content.y + shape.content.h - waterHeight + 20 + (i * 15)}
                    r="2"
                    fill={`url(#${gradId}-bubble)`}
                    className="water-bubbles"
                    style={{ animationDelay: `${i * 0.5}s` }}
                  />
                ))}
              </>
            )}
          </g>

          {/* Contorno del tanque */}
          {shape.outline}


          {/* Indicador de válvula principal */}
          {indicator === "chip" && (
            <div className="absolute top-4 right-4 z-10">
              <RealisticValve
                size={120}
                isOpen={valveOpen}
                isAnimating={valveSpin}
                showControls={false}
                className="valve-indicator"
              />
            </div>
          )}
        </svg>
      </div>
    </div>
  );
}



/**
 * roundedRectPath: Genera path SVG para rectángulo redondeado
 */
function roundedRectPath(x, y, w, h, r) {
  return `M${x + r},${y} L${x + w - r},${y} Q${x + w},${y} ${x + w},${y + r} L${x + w},${y + h - r} Q${x + w},${y + h} ${x + w - r},${y + h} L${x + r},${y + h} Q${x},${y + h} ${x},${y + h - r} L${x},${y + r} Q${x},${y} ${x + r},${y} Z`;
}