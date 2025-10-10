import React, { useMemo, useState } from "react";
import useWebSerial from "@/hooks/useWebSerial";
import { X, Upload, PlugZap, Usb, Search, Package, Download, Star, Clock } from "lucide-react";

export default function FirmwareModal({ open, onClose, device }) {
  const {
    supported, connected, baudRate, setBaudRate,
    log, isBusy, connect, disconnect, sendLine, enterBootloader, write
  } = useWebSerial();

  // ⬇️ Código ESP32 para sistema de tanque de agua
  const defaultSketch = useMemo(() => `
// Sistema de monitoreo de tanque de agua con ESP32
// Componentes: HC-SR04 (ultrasonido), Válvula solenoide, WiFi

#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

// Configuración WiFi
const char* ssid = "TU_WIFI_SSID";
const char* password = "TU_WIFI_PASSWORD";
const char* serverURL = "https://iot-api.gemapp.click/api/devices/data";

// Pines del ESP32
#define TRIG_PIN 4    // Pin trigger del HC-SR04
#define ECHO_PIN 5    // Pin echo del HC-SR04
#define VALVE_PIN 2   // Pin de control de válvula solenoide
#define LED_PIN 13    // LED indicador

// Variables del sistema
float waterLevel = 0;
float distance = 0;
bool valveOpen = false;
unsigned long lastReading = 0;
const unsigned long READING_INTERVAL = 5000; // 5 segundos

void setup() {
  Serial.begin(115200);
  
  // Configurar pines
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  pinMode(VALVE_PIN, OUTPUT);
  pinMode(LED_PIN, OUTPUT);
  
  digitalWrite(VALVE_PIN, LOW); // Válvula cerrada por defecto
  digitalWrite(LED_PIN, LOW);
  
  Serial.println("=== Sistema de Tanque de Agua ===");
  
  // Conectar a WiFi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
  }
  Serial.println();
  Serial.println("WiFi conectado!");
  Serial.print("IP: ");
  Serial.println(WiFi.localIP());
  
  // Calibración inicial
  Serial.println("Calibrando sensor...");
  delay(2000);
}

void loop() {
  // Medir nivel de agua cada 5 segundos
  if (millis() - lastReading >= READING_INTERVAL) {
    measureWaterLevel();
    sendDataToServer();
    lastReading = millis();
  }
  
  // Procesar comandos del puerto serie
  handleSerialCommands();
  
  delay(100);
}

void measureWaterLevel() {
  // Medición con sensor ultrasónico HC-SR04
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);
  
  long duration = pulseIn(ECHO_PIN, HIGH);
  distance = duration * 0.034 / 2; // Convertir a cm
  
  // Tanque de 500L, altura ~50cm
  // Distancia del sensor al fondo: ~50cm
  // Nivel = 100 - (distancia_medida / distancia_maxima * 100)
  float tankHeight = 50.0; // cm
  waterLevel = max(0, min(100, 100 - (distance / tankHeight * 100)));
  
  Serial.printf("Distancia: %.1f cm, Nivel: %.1f%%\\n", distance, waterLevel);
  
  // Control automático de válvula
  if (waterLevel < 20 && !valveOpen) {
    openValve();
  } else if (waterLevel > 80 && valveOpen) {
    closeValve();
  }
}

void openValve() {
  digitalWrite(VALVE_PIN, HIGH);
  valveOpen = true;
  digitalWrite(LED_PIN, HIGH);
  Serial.println("Válvula ABIERTA");
}

void closeValve() {
  digitalWrite(VALVE_PIN, LOW);
  valveOpen = false;
  digitalWrite(LED_PIN, LOW);
  Serial.println("Válvula CERRADA");
}

void sendDataToServer() {
  if (WiFi.status() != WL_CONNECTED) return;
  
  HTTPClient http;
  http.begin(serverURL);
  http.addHeader("Content-Type", "application/json");
  
  // Crear JSON con los datos
  DynamicJsonDocument doc(1024);
  doc["device_id"] = "tank_system_001";
  doc["timestamp"] = millis();
  doc["water_level"] = waterLevel;
  doc["distance"] = distance;
  doc["valve_open"] = valveOpen;
  doc["wifi_signal"] = WiFi.RSSI();
  doc["uptime"] = millis() / 1000;
  
  String jsonString;
  serializeJson(doc, jsonString);
  
  int httpResponseCode = http.POST(jsonString);
  
  if (httpResponseCode > 0) {
    String response = http.getString();
    Serial.printf("Datos enviados: %d\\n", httpResponseCode);
  } else {
    Serial.printf("Error enviando datos: %d\\n", httpResponseCode);
  }
  
  http.end();
}

void handleSerialCommands() {
  if (Serial.available()) {
    String command = Serial.readStringUntil('\\n');
    command.trim();
    
    if (command == "OPEN") {
      openValve();
    } else if (command == "CLOSE") {
      closeValve();
    } else if (command == "STATUS") {
      Serial.printf("Nivel: %.1f%%, Válvula: %s, WiFi: %d dBm\\n", 
                   waterLevel, valveOpen ? "ABIERTA" : "CERRADA", WiFi.RSSI());
    } else if (command == "RESET") {
      ESP.restart();
    } else {
      Serial.println("Comandos: OPEN, CLOSE, STATUS, RESET");
    }
  }
}
  `.trim(), []);

  const [code, setCode] = useState(defaultSketch);
  const [showLibraries, setShowLibraries] = useState(false);
  const [librarySearch, setLibrarySearch] = useState("");
  const [selectedLibraries, setSelectedLibraries] = useState([]);

  // Base de datos de librerías populares para ESP32
  const popularLibraries = useMemo(() => [
    {
      name: "WiFi",
      description: "Conectividad WiFi para ESP32",
      version: "1.0.0",
      downloads: 1500000,
      stars: 5000,
      category: "Network",
      code: "#include <WiFi.h>"
    },
    {
      name: "HTTPClient",
      description: "Cliente HTTP para peticiones web",
      version: "1.0.0",
      downloads: 800000,
      stars: 3000,
      category: "Network",
      code: "#include <HTTPClient.h>"
    },
    {
      name: "ArduinoJson",
      description: "Biblioteca para manejo de JSON",
      version: "7.0.4",
      downloads: 2000000,
      stars: 8000,
      category: "Data",
      code: "#include <ArduinoJson.h>"
    },
    {
      name: "PubSubClient",
      description: "Cliente MQTT para IoT",
      version: "2.8.0",
      downloads: 600000,
      stars: 2500,
      category: "IoT",
      code: "#include <PubSubClient.h>"
    },
    {
      name: "SPIFFS",
      description: "Sistema de archivos para ESP32",
      version: "1.0.0",
      downloads: 400000,
      stars: 1500,
      category: "Storage",
      code: "#include <SPIFFS.h>"
    },
    {
      name: "WebServer",
      description: "Servidor web embebido",
      version: "1.0.0",
      downloads: 500000,
      stars: 2000,
      category: "Network",
      code: "#include <WebServer.h>"
    },
    {
      name: "EEPROM",
      description: "Memoria no volátil",
      version: "2.0.0",
      downloads: 300000,
      stars: 1200,
      category: "Storage",
      code: "#include <EEPROM.h>"
    },
    {
      name: "BluetoothSerial",
      description: "Comunicación Bluetooth",
      version: "1.0.0",
      downloads: 350000,
      stars: 1800,
      category: "Communication",
      code: "#include <BluetoothSerial.h>"
    },
    {
      name: "Wire",
      description: "Comunicación I2C",
      version: "2.0.0",
      downloads: 700000,
      stars: 2200,
      category: "Communication",
      code: "#include <Wire.h>"
    },
    {
      name: "SPI",
      description: "Comunicación SPI",
      version: "1.0.0",
      downloads: 600000,
      stars: 2000,
      category: "Communication",
      code: "#include <SPI.h>"
    },
    {
      name: "Servo",
      description: "Control de servomotores",
      version: "1.1.8",
      downloads: 450000,
      stars: 1600,
      category: "Actuators",
      code: "#include <Servo.h>"
    },
    {
      name: "DHT",
      description: "Sensor de temperatura y humedad",
      version: "1.4.4",
      downloads: 800000,
      stars: 3000,
      category: "Sensors",
      code: "#include <DHT.h>"
    }
  ], []);

  // Filtrar librerías según búsqueda
  const filteredLibraries = useMemo(() => {
    if (!librarySearch) return popularLibraries;
    return popularLibraries.filter(lib => 
      lib.name.toLowerCase().includes(librarySearch.toLowerCase()) ||
      lib.description.toLowerCase().includes(librarySearch.toLowerCase()) ||
      lib.category.toLowerCase().includes(librarySearch.toLowerCase())
    );
  }, [popularLibraries, librarySearch]);

  // Agregar librería al código
  const addLibrary = (library) => {
    if (selectedLibraries.some(lib => lib.name === library.name)) return;
    
    setSelectedLibraries(prev => [...prev, library]);
    setCode(prev => {
      const includes = prev.match(/#include.*$/gm) || [];
      const newInclude = library.code;
      
      if (!includes.some(inc => inc.includes(library.name))) {
        return `${newInclude}\n${prev}`;
      }
      return prev;
    });
  };

  // Remover librería
  const removeLibrary = (libraryName) => {
    setSelectedLibraries(prev => prev.filter(lib => lib.name !== libraryName));
    setCode(prev => prev.replace(new RegExp(`#include.*${libraryName}.*\n?`, 'g'), ''));
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-black/40 p-4">
      <div className="w-full max-w-5xl rounded-2xl bg-white shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b p-4">
          <div>
            <h3 className="text-lg font-semibold">Cargar código a {device?.name || "dispositivo"}</h3>
            {!supported && (
              <p className="text-sm text-red-600">
                Este navegador no soporta Web Serial. Usa Chrome/Edge y HTTPS o localhost.
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-2 text-gray-600 hover:bg-gray-100"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-2 border-b p-3">
          <label className="text-sm text-gray-600">
            Baudios:&nbsp;
            <select
              className="rounded-md border px-2 py-1 text-sm"
              value={baudRate}
              onChange={(e) => setBaudRate(Number(e.target.value))}
              disabled={connected}
            >
              {[9600, 19200, 38400, 57600, 115200, 230400, 460800].map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </label>

          {!connected ? (
            <button
              onClick={connect}
              disabled={!supported}
              className="inline-flex items-center gap-2 rounded-md bg-emerald-600 px-3 py-1.5 text-sm text-white hover:bg-emerald-700 disabled:opacity-50"
            >
              <Usb className="h-4 w-4" /> Conectar
            </button>
          ) : (
            <button
              onClick={disconnect}
              className="inline-flex items-center gap-2 rounded-md bg-gray-200 px-3 py-1.5 text-sm hover:bg-gray-300"
            >
              Desconectar
            </button>
          )}

          <button
            onClick={enterBootloader}
            disabled={!connected || isBusy}
            className="inline-flex items-center gap-2 rounded-md bg-orange-600 px-3 py-1.5 text-sm text-white hover:bg-orange-700 disabled:opacity-50"
            title="Intenta poner el ESP32 en modo bootloader (DTR/RTS)"
          >
            <PlugZap className="h-4 w-4" /> Bootloader
          </button>

          <button
            onClick={() => setShowLibraries(true)}
            className="inline-flex items-center gap-2 rounded-md bg-purple-600 px-3 py-1.5 text-sm text-white hover:bg-purple-700"
            title="Buscar y agregar librerías populares"
          >
            <Package className="h-4 w-4" /> Librerías
          </button>

          <button
            onClick={() => write(code)}
            disabled={!connected}
            className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-3 py-1.5 text-sm text-white hover:bg-indigo-700 disabled:opacity-50"
            title="Enviar contenido del editor tal cual por el puerto serie"
          >
            <Upload className="h-4 w-4" /> Enviar por serie
          </button>

          {/* Placeholder para integrar flasheo de binarios en el futuro */}
          {/* 
            TODO: integrar 'esp-web-tools' para flashear .bin:
            import 'esp-web-tools/dist/web/install-button.js'
            y usar <esp-web-install-button manifest="url-a-tu-manifest.json"></esp-web-install-button>
          */}
        </div>

        {/* Editor + Consola */}
        <div className="grid gap-0 md:grid-cols-2">
          <div className="border-r p-3">
            <label className="mb-2 block text-sm font-medium text-gray-700">Editor</label>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck={false}
              className="h-[340px] w-full resize-none rounded-lg border bg-gray-50 p-3 font-mono text-xs outline-none focus:ring-2 focus:ring-indigo-200"
              placeholder="// Escribe o pega tu código aquí…"
            />
            <p className="mt-2 text-xs text-gray-500">
              Tip: también puedes enviar líneas sueltas con <code className="rounded bg-gray-100 px-1">Enter</code> desde la consola.
            </p>
          </div>

          <div className="p-3">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Consola (RX/TX)
            </label>
            <div className="h-[340px] overflow-auto rounded-lg border bg-black p-2 font-mono text-xs text-gray-100">
              {log.map((l, i) => (
                <div key={i} className={l.type === "error" ? "text-red-400" : l.type === "out" ? "text-emerald-300" : l.type === "in" ? "text-cyan-300" : "text-gray-300"}>
                  [{l.ts.toLocaleTimeString()}] {l.msg}
                </div>
              ))}
            </div>

            {/* Entrada de una sola línea (estilo terminal) */}
            <form
              className="mt-2 flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                const line = e.target.elements.line.value;
                if (line?.length) sendLine(line);
                e.target.reset();
              }}
            >
              <input
                name="line"
                className="flex-1 rounded-md border px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-indigo-200"
                placeholder="Escribe un comando y Enter…"
                autoComplete="off"
              />
              <button className="rounded-md bg-indigo-600 px-3 py-1 text-sm text-white hover:bg-indigo-700">
                Enviar
              </button>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t p-3 text-xs text-gray-500">
          <div>
            {supported ? "Web Serial disponible." : "Web Serial no disponible."} 
            {"  "}Usa Chrome/Edge en HTTPS o localhost.
          </div>
          <button onClick={onClose} className="rounded-md px-3 py-1 hover:bg-gray-100">Cerrar</button>
        </div>
      </div>

      {/* Modal de Librerías */}
      {showLibraries && (
        <div className="fixed inset-0 z-[70] grid place-items-center bg-black/50 p-4">
          <div className="w-full max-w-4xl max-h-[80vh] overflow-hidden rounded-2xl bg-white shadow-xl">
            {/* Header del modal de librerías */}
            <div className="flex items-center justify-between border-b p-4">
              <div>
                <h3 className="text-lg font-semibold">Gestor de Librerías ESP32</h3>
                <p className="text-sm text-gray-600">Busca y agrega librerías populares a tu proyecto</p>
              </div>
              <button
                onClick={() => setShowLibraries(false)}
                className="rounded-md p-2 text-gray-600 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Barra de búsqueda */}
            <div className="border-b p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar librerías por nombre, descripción o categoría..."
                  value={librarySearch}
                  onChange={(e) => setLibrarySearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-transparent"
                />
              </div>
            </div>

            {/* Librerías seleccionadas */}
            {selectedLibraries.length > 0 && (
              <div className="border-b p-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Librerías Seleccionadas ({selectedLibraries.length})</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedLibraries.map((lib) => (
                    <div
                      key={lib.name}
                      className="flex items-center gap-2 bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm"
                    >
                      <Package className="h-3 w-3" />
                      <span>{lib.name}</span>
                      <button
                        onClick={() => removeLibrary(lib.name)}
                        className="hover:text-purple-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Lista de librerías */}
            <div className="max-h-[400px] overflow-y-auto p-4">
              <div className="grid gap-3">
                {filteredLibraries.map((lib) => (
                  <div
                    key={lib.name}
                    className={`border rounded-lg p-4 transition-colors ${
                      selectedLibraries.some(l => l.name === lib.name)
                        ? 'border-purple-300 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-200 hover:bg-purple-50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h5 className="font-semibold text-gray-900">{lib.name}</h5>
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                            {lib.category}
                          </span>
                          <span className="text-xs text-gray-500">v{lib.version}</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{lib.description}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Download className="h-3 w-3" />
                            <span>{lib.downloads.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3" />
                            <span>{lib.stars.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => addLibrary(lib)}
                        disabled={selectedLibraries.some(l => l.name === lib.name)}
                        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                          selectedLibraries.some(l => l.name === lib.name)
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            : 'bg-purple-600 text-white hover:bg-purple-700'
                        }`}
                      >
                        {selectedLibraries.some(l => l.name === lib.name) ? 'Agregada' : 'Agregar'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer del modal de librerías */}
            <div className="flex items-center justify-end gap-2 border-t p-4">
              <button
                onClick={() => setShowLibraries(false)}
                className="rounded-md px-4 py-2 text-sm hover:bg-gray-100"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
