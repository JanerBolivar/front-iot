import React, { useState } from 'react';
import { CheckCircle, XCircle, Loader, Wifi, WifiOff, Server, Database, AlertTriangle } from 'lucide-react';
import { urlBackend } from '@/config/envs';

export default function ApiDiagnostic() {
  const [results, setResults] = useState({});
  const [testing, setTesting] = useState(false);

  const runDiagnostic = async () => {
    setTesting(true);
    const newResults = {};

    // Test 1: Conectividad básica
    try {
      const startTime = Date.now();
      const response = await fetch(`${urlBackend}/api-docs/`, {
        method: 'GET'
      });
      const endTime = Date.now();
      
      newResults.connectivity = {
        status: response.ok ? 'success' : 'error',
        message: response.ok ? `Conectado (${endTime - startTime}ms)` : `Error: ${response.status}`,
        details: `Status: ${response.status}, Tiempo: ${endTime - startTime}ms`
      };
    } catch (error) {
      newResults.connectivity = {
        status: 'error',
        message: 'No se puede conectar',
        details: error.message
      };
    }

    // Test 2: Endpoints de autenticación
    try {
      const response = await fetch(`${urlBackend}/api/user/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test@test.com', password: 'test' })
      });
      
      newResults.auth = {
        status: (response.ok || response.status === 401) ? 'success' : 'warning',
        message: (response.ok || response.status === 401) ? 'Endpoints de auth disponibles' : `Auth endpoint error: ${response.status}`,
        details: `Status: ${response.status}`
      };
    } catch (error) {
      newResults.auth = {
        status: 'error',
        message: 'Auth endpoints no disponibles',
        details: error.message
      };
    }

    // Test 3: Endpoints de usuarios
    try {
      const response = await fetch(`${urlBackend}/api/user/users`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      newResults.users = {
        status: (response.ok || response.status === 401) ? 'success' : 'warning',
        message: (response.ok || response.status === 401) ? 'Endpoints de usuarios disponibles' : `Users endpoint error: ${response.status}`,
        details: `Status: ${response.status}`
      };
    } catch (error) {
      newResults.users = {
        status: 'error',
        message: 'Users endpoints no disponibles',
        details: error.message
      };
    }

    // Test 4: Endpoints de dispositivos
    try {
      const response = await fetch(`${urlBackend}/api/device/device-list`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      newResults.devices = {
        status: (response.ok || response.status === 401) ? 'success' : 'warning',
        message: (response.ok || response.status === 401) ? 'Endpoints de dispositivos disponibles' : `Devices endpoint error: ${response.status}`,
        details: `Status: ${response.status}`
      };
    } catch (error) {
      newResults.devices = {
        status: 'error',
        message: 'Devices endpoints no disponibles',
        details: error.message
      };
    }

    // Test 5: Documentación API
    try {
      const response = await fetch(`${urlBackend}/api-docs/`, {
        method: 'GET'
      });
      
      newResults.docs = {
        status: response.ok ? 'success' : 'warning',
        message: response.ok ? 'Documentación disponible' : `Docs error: ${response.status}`,
        details: `Status: ${response.status}`
      };
    } catch (error) {
      newResults.docs = {
        status: 'error',
        message: 'Documentación no disponible',
        details: error.message
      };
    }

    setResults(newResults);
    setTesting(false);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Loader className="h-5 w-5 text-gray-500 animate-spin" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
        return 'border-green-200 bg-green-50';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50';
      case 'error':
        return 'border-red-200 bg-red-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-6 border border-blue-200">
        <div className="flex items-center space-x-3 mb-4">
          <Server className="h-8 w-8 text-blue-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Diagnóstico de API</h2>
            <p className="text-gray-600">Verificación de conectividad con el backend</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={runDiagnostic}
            disabled={testing}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {testing ? (
              <>
                <Loader className="h-4 w-4 mr-2 animate-spin" />
                Probando...
              </>
            ) : (
              <>
                <Wifi className="h-4 w-4 mr-2" />
                Ejecutar Diagnóstico
              </>
            )}
          </button>
          
          <div className="text-sm text-gray-600">
            <strong>Base URL:</strong> {urlBackend}
          </div>
        </div>
      </div>

      {Object.keys(results).length > 0 && (
        <div className="grid gap-4">
          {Object.entries(results).map(([key, result]) => (
            <div key={key} className={`rounded-lg border p-4 ${getStatusColor(result.status)}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(result.status)}
                  <div>
                    <h3 className="font-semibold text-gray-800 capitalize">
                      {key === 'connectivity' && 'Conectividad'}
                      {key === 'auth' && 'Autenticación'}
                      {key === 'users' && 'Usuarios'}
                      {key === 'devices' && 'Dispositivos'}
                      {key === 'docs' && 'Documentación'}
                    </h3>
                    <p className="text-sm text-gray-600">{result.message}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">{result.details}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Información adicional */}
      <div className="bg-white rounded-xl border shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Información del Backend</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-700">URL Base:</span>
            <p className="text-gray-600">{urlBackend}</p>
          </div>
          <div>
            <span className="font-medium text-gray-700">Documentación:</span>
            <a 
              href={`${urlBackend}/api-docs/`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800"
            >
              Ver API Docs
            </a>
          </div>
          <div>
            <span className="font-medium text-gray-700">Plataforma:</span>
            <p className="text-gray-600">Render.com</p>
          </div>
          <div>
            <span className="font-medium text-gray-700">Estado:</span>
            <p className="text-gray-600">En desarrollo</p>
          </div>
        </div>
      </div>
    </div>
  );
}
