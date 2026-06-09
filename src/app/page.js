"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [usuario, setUsuario] = useState(null);
  const [rol, setRol] = useState(null);
  const [cargando, setCargando] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const usuarioGuardado = localStorage.getItem("usuario");
    const rolGuardado = localStorage.getItem("rol");

    // 🛡️ CONTROL DE ACCESO: Si no hay token, lo mandamos al Login de una
    if (!token) {
      router.push("/login");
      return;
    }

    // Si hay token, cargamos los datos del usuario para personalizar la vista
    if (usuarioGuardado) {
      setRol(rolGuardado ? rolGuardado.toLowerCase() : "colaborador");
      
      if (usuarioGuardado.includes("@")) {
        setUsuario(usuarioGuardado.split("@")[0].replace(".", " "));
      } else {
        setUsuario(usuarioGuardado);
      }
    }
    
    setCargando(false);
  }, [router]);

  // Mientras verifica el localStorage o hace la redirección, mostramos una pantalla limpia
  if (cargando) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans py-32">
        <p className="text-gray-500">Verificando sesión...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black py-32">
      <main className="flex flex-col items-center gap-4 bg-white p-8 rounded-xl shadow-sm dark:bg-zinc-900 max-w-md text-center">
        <h1 className="text-4xl font-bold text-blue-600">
          ¡Bienvenido, <span className="capitalize">{usuario || "Usuario"}</span>!
        </h1>
        <p className="text-gray-600">
          Has ingresado con el rol de: <strong className="text-blue-500 capitalize">{rol}</strong>
        </p>
        <hr className="w-full border-zinc-100 my-2" />
        <p className="text-gray-500 text-sm">
          Utiliza el menú superior para gestionar tus {rol === "admin" || rol === "supervisor" ? "usuarios y plantillas" : "asignaciones del día"}.
        </p>
      </main>
    </div>
  );
}