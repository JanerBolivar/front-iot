// src/pages/Public/DocsPublic.jsx
import React from "react";
import { Link } from "react-router-dom";
import { Droplets, Radio, Cpu, PlugZap, LayoutGrid, Puzzle, Gauge, Activity, Wrench } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import TankViz from "@/components/features/devices/TankViz";
import SensorDemo from "@/components/features/dashboard/SensorDemo";
import ValveDemo from "@/components/features/dashboard/ValveDemo";

const SECTIONS = [
  { id: "overview",     title: "Visión general",     icon: <LayoutGrid className="h-4 w-4" /> },
  { id: "componentes",  title: "Componentes",        icon: <Puzzle className="h-4 w-4" /> },
  { id: "tanque",       title: "Tanque",             icon: <Gauge className="h-4 w-4" /> },
  { id: "sensor",       title: "Sensor ultrasónico", icon: <Activity className="h-4 w-4" /> },
  { id: "valvula",      title: "Válvula solenoide",  icon: <Wrench className="h-4 w-4" /> },
  { id: "matematicas",  title: "Matemáticas",        icon: <Droplets className="h-4 w-4" /> },
  { id: "aplicaciones", title: "Aplicaciones",       icon: <Radio className="h-4 w-4" /> },
  { id: "dispositivos", title: "Dispositivos/FW",    icon: <Cpu className="h-4 w-4" /> },
];

export default function DocsPublic() {
  const { user } = useAuth();

  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="grid gap-6 md:grid-cols-2 md:items-center">
        <div>
          <h1 className="text-3xl font-bold leading-tight">
            Monitoreo de nivel de agua con ESP32
          </h1>
        <p className="mt-3 text-gray-600 dark:text-gray-400">
            Plataforma web para visualizar el nivel de un tanque, controlar una válvula solenoide y
            cargar firmware al ESP32 desde tu navegador.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to={user ? "/app/overview" : "/login"}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              {user ? "Ir al panel" : "Iniciar sesión"}
            </Link>
            {!user && (
              <Link to="/register" className="rounded-md border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                Crear cuenta
              </Link>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 p-6 space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <p>• Visual: tanque animado, historial persistente y métricas del sistema.</p>
          <p>• Control: abrir/cerrar válvula, estado en tiempo real.</p>
          <p>• Configuración: Web Serial API para conectar con el ESP32.</p>
        </div>
      </section>

      {/* Índice + contenido largo */}
      <div className="lg:flex lg:items-start lg:gap-10">
        {/* Índice pegajoso */}
        <aside className="hidden lg:block w-64 shrink-0">
          <nav className="sticky top-20 space-y-1">
            <p className="mb-2 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Índice</p>
            {SECTIONS.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {s.icon}
                <span>{s.title}</span>
              </a>
            ))}
            <a href="#top" className="mt-2 block rounded-md px-2 py-1.5 text-xs text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">
              ↑ Volver arriba
            </a>
          </nav>
        </aside>

        {/* Contenido scrolleable */}
        <article className="min-w-0 flex-1 space-y-12">
          <DocSection id="overview"    title="Visión general">
            <p>
              El sistema une un <strong>ESP32</strong> con un sensor ultrasónico para medir nivel y una
              <strong> válvula solenoide</strong> para control. La web muestra el tanque con animación,
              guarda un historial por sistema en el navegador (localStorage) y permite exportar a CSV.
            </p>
          </DocSection>

          <DocSection id="componentes" title="Componentes">
            <ul className="list-disc pl-6 space-y-1">
              <li>ESP32 (controlador principal).</li>
              <li>HC-SR04 u otro sensor de distancia compatible.</li>
              <li>Válvula solenoide + relevador o driver.</li>
              <li>Fuente apropiada e instalación eléctrica segura.</li>
            </ul>
          </DocSection>

          <DocSection id="tanque" title="Tanque de Almacenamiento 500L">
            <div className="space-y-6">
              <p>
                Recipiente cilíndrico vertical de polietileno de alta densidad para almacenamiento de agua.
                La visualización del tanque usa <em>SVG</em> con olas y burbujas mejoradas. Muestra porcentaje y
                litros estimados (en base a la capacidad configurada). También indica el estado de la válvula.
              </p>

              {/* Demostración Interactiva del Tanque */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6 flex items-center">
                  <Droplets className="w-6 h-6 text-cyan-600 mr-3" />
                  🎮 Demostración Interactiva - Tanque 500L
                </h3>
                
                <div className="grid lg:grid-cols-2 gap-8">
                  {/* Visualización del Tanque */}
                  <div className="space-y-4">
                    <TankViz
                      level={75}
                      capacityLiters={500}
                      variant="rect"
                      indicator="chip"
                      valveOpen={true}
                      valveSpin={false}
                      showHeader={true}
                      showPercent={true}
                      className="mx-auto"
                    />
                  </div>

                  {/* Información del tanque */}
                  <div className="space-y-6">
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
                      <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center">
                        <Droplets className="w-5 h-5 text-blue-600 mr-2" />
                        📊 Especificaciones Técnicas
                      </h4>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="font-medium text-gray-700 dark:text-gray-300">Capacidad:</span>
                          <p className="text-gray-600 dark:text-gray-400">500 Litros</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700 dark:text-gray-300">Diámetro Inferior:</span>
                          <p className="text-gray-600 dark:text-gray-400">0.65 m</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700 dark:text-gray-300">Diámetro Superior:</span>
                          <p className="text-gray-600 dark:text-gray-400">1.02 m</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700 dark:text-gray-300">Altura:</span>
                          <p className="text-gray-600 dark:text-gray-400">1.15 m</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700 dark:text-gray-300">Material:</span>
                          <p className="text-gray-600 dark:text-gray-400">PEAD</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700 dark:text-gray-300">Peso vacío:</span>
                          <p className="text-gray-600 dark:text-gray-400">25 kg</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 rounded-lg p-4 border border-green-200 dark:border-green-700">
                      <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center">
                        🎨 Características de la Visualización
                      </h4>
                      <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                        <li className="flex items-start">
                          <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          <span><strong>Ondas Multi-capa:</strong> 5 capas de ondas con diferentes frecuencias</span>
                        </li>
                        <li className="flex items-start">
                          <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          <span><strong>Burbujas Realistas:</strong> 12 burbujas con movimientos flotantes</span>
                        </li>
                        <li className="flex items-start">
                          <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          <span><strong>Gradientes Avanzados:</strong> Múltiples gradientes para profundidad</span>
                        </li>
                        <li className="flex items-start">
                          <span className="w-2 h-2 bg-cyan-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          <span><strong>Efectos de Flujo:</strong> Animaciones cuando la válvula está abierta</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </DocSection>

          <DocSection id="sensor" title="Sensor Ultrasónico HC-SR04">
            <div className="space-y-6">
              <p>
                Dispositivo de medición de distancias basado en el principio de tiempo de vuelo de ondas ultrasónicas.
                Medimos la distancia al espejo de agua; con la geometría conocida del tanque, transformamos
                distancia en porcentaje. Es importante filtrar ruido y calibrar el cero/lleno.
              </p>

              {/* Demostración Interactiva del Sensor */}
              <SensorDemo />
            </div>
          </DocSection>

          <DocSection id="valvula" title="Válvula Solenoide">
            <div className="space-y-6">
              <p>
                Actuador electromecánico para el control preciso del flujo de agua en el sistema.
                Se controla con un pin del ESP32 vía relevador/driver. En la UI verás un chip (verde/rojo)
                y acciones (abrir/cerrar) cuando se integre el control remoto.
              </p>

              {/* Demostración Interactiva de la Válvula */}
              <ValveDemo />
            </div>
          </DocSection>

          <DocSection id="matematicas" title="Matemáticas">
            <p>
              Para un tanque rectangular: <code>nivel% = (altura-agua)/altura * 100</code>. Para otras
              geometrías (cilindro, etc.) se usan fórmulas específicas (sección Matemáticas del panel).
            </p>
          </DocSection>

          <DocSection id="aplicaciones" title="Aplicaciones">
            <p>
              Riego, plantas piloto, depósitos domésticos o industriales. La app está pensada para usuarios
              no técnicos: todo se hace desde el navegador.
            </p>
          </DocSection>

          <DocSection id="dispositivos" title="Dispositivos y firmware">
            <p>
              Desde <strong>Configurar</strong> puedes conectar el ESP32 con Web Serial para enviar comandos
              o cargar código (cuando integres el firmware final). El historial de telemetría se guarda por
              <em> system.id</em> en localStorage.
            </p>
            <div className="mt-3 text-sm">
              <Link to={user ? "/app/devices" : "/login"} className="text-blue-600 dark:text-blue-400 hover:underline">
                Ver dispositivos
              </Link>
            </div>
          </DocSection>
        </article>
      </div>
    </div>
  );
}

function DocSection({ id, title, children }) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="mb-3 text-xl font-semibold text-gray-900 dark:text-gray-100">{title}</h2>
      <div className="prose prose-sm max-w-none text-gray-700 dark:text-gray-300">{children}</div>
    </section>
  );
}
