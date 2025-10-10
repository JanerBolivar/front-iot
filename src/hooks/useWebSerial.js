// Simple hook para Web Serial con ESP32
import { useCallback, useEffect, useRef, useState } from "react";

export default function useWebSerial() {
  const supported = typeof navigator !== "undefined" && "serial" in navigator;

  const [port, setPort] = useState(null);
  const [connected, setConnected] = useState(false);
  const [baudRate, setBaudRate] = useState(115200);
  const [log, setLog] = useState([]);
  const [isBusy, setIsBusy] = useState(false);

  const readerRef = useRef(null);
  const writerRef = useRef(null);
  const readLoopAbort = useRef({ abort: false });
  const textDecoder = useRef(null);
  const textEncoder = useRef(null);

  const pushLog = useCallback((msg, type = "info") => {
    setLog((prev) => [...prev.slice(-300), { ts: new Date(), type, msg }]);
  }, []);

  const connect = useCallback(async () => {
    if (!supported) {
      pushLog("Este navegador no soporta Web Serial.", "error");
      return;
    }
    try {
      const p = await navigator.serial.requestPort();
      await p.open({ baudRate });
      setPort(p);
      setConnected(true);
      pushLog(`Conectado @ ${baudRate} baudios`);

      // Setup streams
      textDecoder.current = new TextDecoderStream();
      p.readable.pipeTo(textDecoder.current.writable);
      readerRef.current = textDecoder.current.readable.getReader();

      textEncoder.current = new TextEncoderStream();
      textEncoder.current.readable.pipeTo(p.writable);
      writerRef.current = textEncoder.current.writable.getWriter();

      // Loop de lectura
      readLoopAbort.current.abort = false;
      (async () => {
        try {
          while (!readLoopAbort.current.abort) {
            const { value, done } = await readerRef.current.read();
            if (done) break;
            if (value) pushLog(value, "in");
          }
        } catch (e) {
          pushLog(`Lectura detenida: ${e?.message || e}`, "warn");
        }
      })();
    } catch (e) {
      pushLog(`No se pudo abrir el puerto: ${e?.message || e}`, "error");
    }
  }, [baudRate, pushLog, supported]);

  const disconnect = useCallback(async () => {
    try {
      readLoopAbort.current.abort = true;

      if (readerRef.current) {
        try { await readerRef.current.cancel(); } catch (error) {
          console.warn('Error canceling reader:', error);
        }
        try { await readerRef.current.releaseLock(); } catch (error) {
          console.warn('Error releasing reader lock:', error);
        }
      }
      if (writerRef.current) {
        try { await writerRef.current.close(); } catch (error) {
          console.warn('Error closing writer:', error);
        }
        try { await writerRef.current.releaseLock(); } catch (error) {
          console.warn('Error releasing writer lock:', error);
        }
      }
      if (port) {
        try { await port.close(); } catch (error) {
          console.warn('Error closing port:', error);
        }
      }
    } finally {
      setConnected(false);
      setPort(null);
      pushLog("Desconectado");
    }
  }, [port, pushLog]);

  const write = useCallback(async (text) => {
    if (!writerRef.current) {
      pushLog("No hay conexión abierta", "error");
      return;
    }
    try {
      await writerRef.current.write(text);
      pushLog(text, "out");
    } catch (e) {
      pushLog(`Error enviando: ${e?.message || e}`, "error");
    }
  }, [pushLog]);

  // Secuencia típica para poner ESP32 en modo bootloader con DTR/RTS
  const enterBootloader = useCallback(async () => {
    if (!port?.setSignals) {
      pushLog("Este puerto no permite manipular señales DTR/RTS.", "warn");
      return;
    }
    setIsBusy(true);
    try {
      // En muchos adaptadores: DTR -> IO0, RTS -> EN
      await port.setSignals({ dataTerminalReady: false, requestToSend: true });
      await new Promise((r) => setTimeout(r, 100));
      await port.setSignals({ dataTerminalReady: true, requestToSend: false });
      await new Promise((r) => setTimeout(r, 100));
      await port.setSignals({ dataTerminalReady: false, requestToSend: false });
      pushLog("Secuencia de bootloader enviada (DTR/RTS).");
    } catch (e) {
      pushLog(`No se pudo alternar DTR/RTS: ${e?.message || e}`, "error");
    } finally {
      setIsBusy(false);
    }
  }, [port, pushLog]);

  // Enviar con salto de línea al estilo terminal
  const sendLine = useCallback(async (line) => {
    await write(`${line}\r\n`);
  }, [write]);

  // Limpieza al desmontar
  useEffect(() => {
    return () => { disconnect(); };
  }, [disconnect]);

  return {
    supported,
    connected,
    baudRate,
    setBaudRate,
    log,
    isBusy,
    connect,
    disconnect,
    write,
    sendLine,
    enterBootloader,
  };
}
