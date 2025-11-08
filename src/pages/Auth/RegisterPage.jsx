import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";



export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [pass1, setPass1] = useState("");
  const [pass2, setPass2] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !pass1 || !pass2) {
      return toast.error("Completa todos los campos");
    }
    if (pass1.length < 6) return toast.error("La contraseña debe tener al menos 6 caracteres");
    if (pass1 !== pass2) return toast.error("Las contraseñas no coinciden");

    setSubmitting(true);
    try {
      await register({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        password: pass1,
      });
      toast.success("Cuenta creada. Ahora inicia sesión.");
      navigate("/login");
    } catch (err) {
      toast.error(err.message || "No se pudo registrar");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-gray-50 dark:bg-gray-900 p-4">
      {/* Botón para volver al inicio */}
      <div className="absolute top-4 left-4">
        <Link
          to="/docs"
          className="inline-flex items-center gap-2 rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <Home className="h-4 w-4" />
          Volver al inicio
        </Link>
      </div>

      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Crear cuenta</CardTitle>
          <CardDescription>Regístrate para acceder al dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={onSubmit}>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">Primer Nombre</Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Ej: Juan"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Primer Apellido</Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Ej: Pérez"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Correo</Label>
              <Input id="email" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="tucorreo@demo.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pass1">Contraseña</Label>
              <Input id="pass1" type="password" value={pass1} onChange={(e)=>setPass1(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pass2">Repetir contraseña</Label>
              <Input id="pass2" type="password" value={pass2} onChange={(e)=>setPass2(e.target.value)} />
            </div>
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? "Creando…" : "Crear cuenta"}
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              ¿Ya tienes cuenta? <Link to="/login" className="underline">Inicia sesión</Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
