import React, { useState } from 'react';

export default function RealisticValve({ 
  size = 200, 
  isOpen = true, 
  isAnimating = false, 
  onToggle = null,
  showControls = true,
  className = ""
}) {
  const [internalIsOpen, setInternalIsOpen] = useState(isOpen);
  const [internalIsAnimating, setInternalIsAnimating] = useState(false);

  // Usar props externas si están disponibles, sino usar estado interno
  const currentIsOpen = onToggle ? isOpen : internalIsOpen;
  const currentIsAnimating = onToggle ? isAnimating : internalIsAnimating;

  const handleToggle = () => {
    if (currentIsAnimating) return;
    
    if (onToggle) {
      onToggle();
    } else {
      setInternalIsAnimating(true);
      setInternalIsOpen(!internalIsOpen);
      setTimeout(() => setInternalIsAnimating(false), 1500);
    }
  };

  return (
    <div className={`realistic-valve ${className}`}>
      <style>{`
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

        @keyframes handAppear {
          0% { 
            opacity: 0; 
            transform: translate(-20px, -20px) scale(0.8); 
          }
          15% { 
            opacity: 1; 
            transform: translate(0, 0) scale(1); 
          }
          85% { 
            opacity: 1; 
            transform: translate(0, 0) scale(1); 
          }
          100% { 
            opacity: 0; 
            transform: translate(20px, 20px) scale(0.8); 
          }
        }

        @keyframes handRotateOpen {
          0% { transform: rotate(0deg); }
          20% { transform: rotate(-5deg); }
          100% { transform: rotate(90deg); }
        }

        @keyframes handRotateClose {
          0% { transform: rotate(90deg); }
          20% { transform: rotate(95deg); }
          100% { transform: rotate(0deg); }
        }

        @keyframes flowOpen {
          0% { 
            stroke-dashoffset: 200; 
            opacity: 0;
          }
          30% { 
            opacity: 0.3;
          }
          100% { 
            stroke-dashoffset: 0; 
            opacity: 0.8;
          }
        }

        @keyframes flowClose {
          0% { 
            stroke-dashoffset: 0; 
            opacity: 0.8;
          }
          100% { 
            stroke-dashoffset: 200; 
            opacity: 0;
          }
        }

        @keyframes glowOpen {
          0% { filter: drop-shadow(0 0 5px rgba(34, 197, 94, 0)); }
          100% { filter: drop-shadow(0 0 20px rgba(34, 197, 94, 0.6)); }
        }

        @keyframes glowClose {
          0% { filter: drop-shadow(0 0 20px rgba(34, 197, 94, 0.6)); }
          100% { filter: drop-shadow(0 0 5px rgba(239, 68, 68, 0)); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }

        .valve-rotating-open {
          animation: rotateValveOpen 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }

        .valve-rotating-close {
          animation: rotateValveClose 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }

        .hand-animating-open {
          animation: handAppear 1.2s ease-out forwards,
                     handRotateOpen 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }

        .hand-animating-close {
          animation: handAppear 1s ease-out forwards,
                     handRotateClose 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }

        .flow-opening {
          animation: flowOpen 0.8s ease-out forwards 0.4s;
        }

        .flow-closing {
          animation: flowClose 0.6s ease-in forwards;
        }

        .glow-opening {
          animation: glowOpen 0.8s ease-out forwards 0.4s;
        }

        .glow-closing {
          animation: glowClose 0.6s ease-in forwards;
        }

        .status-pulse {
          animation: pulse 2s ease-in-out infinite;
        }
      `}</style>

      <div className="w-full">
        {/* Panel de control - solo si showControls es true */}
        {showControls && (
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Control de Válvula Industrial</h2>
                <p className="text-slate-400">Simula la interacción realista con una válvula de paso</p>
              </div>
              <div className={`px-4 py-2 rounded-full font-semibold ${
                currentIsOpen ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
              } ${!currentIsAnimating ? 'status-pulse' : ''}`}>
                {currentIsOpen ? '● ABIERTO' : '● CERRADO'}
              </div>
            </div>

            <button
              onClick={handleToggle}
              disabled={currentIsAnimating}
              className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 ${
                currentIsAnimating 
                  ? 'bg-slate-600 cursor-not-allowed text-slate-400' 
                  : currentIsOpen
                    ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/30 hover:shadow-red-500/50'
                    : 'bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-500/30 hover:shadow-green-500/50'
              }`}
            >
              {currentIsAnimating ? 'GIRANDO VÁLVULA...' : currentIsOpen ? '🔒 CERRAR VÁLVULA' : '🔓 ABRIR VÁLVULA'}
            </button>
          </div>
        )}

        {/* Visualización de la válvula */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-12 border border-slate-700">
          <div className="relative flex items-center justify-center">
            {/* Tuberías de fondo */}
            <svg
              viewBox="0 0 400 400"
              className="absolute w-full h-full"
              style={{ width: `${size}px`, height: `${size}px` }}
            >
              {/* Tubería izquierda */}
              <rect x="10" y="180" width="150" height="40" fill="#475569" rx="4" />
              <rect x="10" y="185" width="150" height="10" fill="#64748b" opacity="0.5" />
              
              {/* Tubería derecha */}
              <rect x="240" y="180" width="150" height="40" fill="#475569" rx="4" />
              <rect x="240" y="185" width="150" height="10" fill="#64748b" opacity="0.5" />

              {/* Flujo de agua - izquierda */}
              <path
                d="M 10 200 L 160 200"
                stroke={currentIsOpen ? "#22c55e" : "#ef4444"}
                strokeWidth="3"
                strokeDasharray="10 5"
                strokeLinecap="round"
                fill="none"
                className={
                  currentIsAnimating 
                    ? (currentIsOpen ? 'flow-opening' : 'flow-closing')
                    : ''
                }
                style={{
                  opacity: currentIsOpen && !currentIsAnimating ? 0.8 : 0,
                  strokeDashoffset: currentIsOpen && !currentIsAnimating ? 0 : 200
                }}
              />

              {/* Flujo de agua - derecha */}
              <path
                d="M 240 200 L 390 200"
                stroke={currentIsOpen ? "#22c55e" : "#ef4444"}
                strokeWidth="3"
                strokeDasharray="10 5"
                strokeLinecap="round"
                fill="none"
                className={
                  currentIsAnimating 
                    ? (currentIsOpen ? 'flow-opening' : 'flow-closing')
                    : ''
                }
                style={{
                  opacity: currentIsOpen && !currentIsAnimating ? 0.8 : 0,
                  strokeDashoffset: currentIsOpen && !currentIsAnimating ? 0 : 200
                }}
              />
            </svg>

            {/* Válvula principal */}
            <div className="relative z-10">
              <svg
                viewBox="0 0 200 200"
                className={`transition-all duration-300 ${
                  currentIsAnimating 
                    ? (currentIsOpen ? 'glow-opening' : 'glow-closing')
                    : ''
                }`}
                style={{
                  width: `${size * 0.64}px`,
                  height: `${size * 0.64}px`,
                  filter: currentIsOpen && !currentIsAnimating 
                    ? 'drop-shadow(0 0 20px rgba(34, 197, 94, 0.6))' 
                    : 'drop-shadow(0 0 5px rgba(239, 68, 68, 0))'
                }}
              >
                <defs>
                  <radialGradient id="metalGradient">
                    <stop offset="0%" stopColor={currentIsOpen ? "#86efac" : "#fca5a5"} />
                    <stop offset="50%" stopColor={currentIsOpen ? "#22c55e" : "#ef4444"} />
                    <stop offset="100%" stopColor={currentIsOpen ? "#15803d" : "#b91c1c"} />
                  </radialGradient>

                  <linearGradient id="pipeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#64748b" />
                    <stop offset="100%" stopColor="#475569" />
                  </linearGradient>
                </defs>

                {/* Cuerpo de la válvula */}
                <g
                  className={
                    currentIsAnimating 
                      ? (currentIsOpen ? 'valve-rotating-open' : 'valve-rotating-close')
                      : ''
                  }
                  style={{
                    transformOrigin: '100px 100px',
                    transform: currentIsOpen && !currentIsAnimating ? 'rotate(90deg)' : 'rotate(0deg)'
                  }}
                >
                  {/* Anillo exterior */}
                  <circle
                    cx="100"
                    cy="100"
                    r="60"
                    fill="none"
                    stroke="url(#metalGradient)"
                    strokeWidth="8"
                  />

                  {/* Anillo medio */}
                  <circle
                    cx="100"
                    cy="100"
                    r="48"
                    fill="none"
                    stroke="url(#metalGradient)"
                    strokeWidth="4"
                    opacity="0.7"
                  />

                  {/* Anillo interno */}
                  <circle
                    cx="100"
                    cy="100"
                    r="35"
                    fill="none"
                    stroke="url(#metalGradient)"
                    strokeWidth="6"
                  />

                  {/* Cruz de giro - vertical */}
                  <line
                    x1="100"
                    y1="70"
                    x2="100"
                    y2="130"
                    stroke="url(#metalGradient)"
                    strokeWidth="8"
                    strokeLinecap="round"
                  />

                  {/* Cruz de giro - horizontal */}
                  <line
                    x1="70"
                    y1="100"
                    x2="130"
                    y2="100"
                    stroke="url(#metalGradient)"
                    strokeWidth="8"
                    strokeLinecap="round"
                  />

                  {/* Diagonales */}
                  <line
                    x1="78"
                    y1="78"
                    x2="122"
                    y2="122"
                    stroke="url(#metalGradient)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    opacity="0.6"
                  />
                  <line
                    x1="122"
                    y1="78"
                    x2="78"
                    y2="122"
                    stroke="url(#metalGradient)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    opacity="0.6"
                  />

                  {/* Tornillos decorativos */}
                  <circle cx="48" cy="48" r="5" fill="url(#metalGradient)" />
                  <circle cx="152" cy="48" r="5" fill="url(#metalGradient)" />
                  <circle cx="152" cy="152" r="5" fill="url(#metalGradient)" />
                  <circle cx="48" cy="152" r="5" fill="url(#metalGradient)" />

                  {/* Centro */}
                  <circle
                    cx="100"
                    cy="100"
                    r="12"
                    fill="url(#metalGradient)"
                  />

                  {/* Marcador de posición */}
                  <polygon
                    points="100,50 108,62 92,62"
                    fill={currentIsOpen ? "#22c55e" : "#ef4444"}
                  />
                </g>

                {/* Base fija de la válvula */}
                <circle
                  cx="100"
                  cy="100"
                  r="75"
                  fill="none"
                  stroke="#334155"
                  strokeWidth="4"
                  opacity="0.3"
                />

                {/* Conexiones de tubería */}
                <rect x="10" y="90" width="30" height="20" fill="url(#pipeGradient)" />
                <rect x="160" y="90" width="30" height="20" fill="url(#pipeGradient)" />
              </svg>

              {/* Mano animada */}
              {currentIsAnimating && (
                <div
                  className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none ${
                    currentIsOpen ? 'hand-animating-open' : 'hand-animating-close'
                  }`}
                  style={{
                    transformOrigin: 'center center',
                    transform: currentIsOpen && !currentIsAnimating ? 'rotate(90deg)' : 'rotate(0deg)'
                  }}
                >
                  <svg viewBox="0 0 100 120" style={{ width: `${size * 0.32}px`, height: `${size * 0.384}px` }}>
                    <defs>
                      <linearGradient id="skinGradient" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#fcd34d" />
                        <stop offset="100%" stopColor="#f59e0b" />
                      </linearGradient>
                    </defs>

                    {/* Palma */}
                    <ellipse cx="50" cy="70" rx="20" ry="28" fill="url(#skinGradient)" />

                    {/* Pulgar */}
                    <ellipse cx="32" cy="58" rx="8" ry="15" fill="url(#skinGradient)" transform="rotate(-25 32 58)" />

                    {/* Dedos */}
                    <rect x="42" y="40" width="6" height="20" rx="3" fill="url(#skinGradient)" />
                    <rect x="50" y="35" width="6" height="22" rx="3" fill="url(#skinGradient)" />
                    <rect x="58" y="38" width="6" height="20" rx="3" fill="url(#skinGradient)" />

                    {/* Muñeca */}
                    <rect x="40" y="90" width="20" height="25" rx="5" fill="url(#skinGradient)" />

                    {/* Sombras */}
                    <ellipse cx="50" cy="70" rx="18" ry="25" fill="black" opacity="0.15" />
                  </svg>
                </div>
              )}
            </div>
          </div>

          {/* Indicadores de flujo */}
          <div className="flex justify-between items-center mt-6 mb-4 text-sm">
            <div className={`flex items-center gap-2 ${currentIsOpen ? 'text-green-400' : 'text-slate-500'}`}>
              <div className={`w-3 h-3 rounded-full ${currentIsOpen ? 'bg-green-400 animate-pulse' : 'bg-slate-600'}`}></div>
              <span>Entrada</span>
            </div>
            <div className={`flex items-center gap-2 ${currentIsOpen ? 'text-green-400' : 'text-slate-500'}`}>
              <span>Salida</span>
              <div className={`w-3 h-3 rounded-full ${currentIsOpen ? 'bg-green-400 animate-pulse' : 'bg-slate-600'}`}></div>
            </div>
          </div>

          {/* Estado de la válvula */}
          <div className="flex justify-center">
            <div className={`px-4 py-2 rounded-lg text-sm font-medium ${
              currentIsOpen 
                ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                : 'bg-red-500/20 text-red-400 border border-red-500/30'
            }`}>
              {currentIsOpen ? 'Abierto' : 'Cerrado'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
