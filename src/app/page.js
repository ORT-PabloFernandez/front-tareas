"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API_URL = "https://checklist-fwabdbgzf3cvf2br.brazilsouth-01.azurewebsites.net";

export default function Home() {
  const [usuario, setUsuario] = useState(null);
  const [rol, setRol] = useState(null);
  const [cargando, setCargando] = useState(true);
  
  
  const [asignaciones, setAsignaciones] = useState([]);
  const [cargandoDatos, setCargandoDatos] = useState(false);
  const [errorDatos, setErrorDatos] = useState("");

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const usuarioGuardado = localStorage.getItem("usuario");
    const rolGuardado = localStorage.getItem("rol");

    if (!token) {
      router.push("/login");
      return;
    }

    if (usuarioGuardado) {
      const rolFormateado = rolGuardado ? rolGuardado.toLowerCase() : "colaborador";
      setRol(rolFormateado);
      
      if (usuarioGuardado.includes("@")) {
        setUsuario(usuarioGuardado.split("@")[0].replace(".", " "));
      } else {
        setUsuario(usuarioGuardado);
      }

      
      traerAsignaciones(token, rolFormateado);
    }
    
    setCargando(false);
  }, [router]);

  
  async function traerAsignaciones(token, userRole) {
    setCargandoDatos(true);
    setErrorDatos("");
    
    
    const endpoint = (userRole === "admin" || userRole === "supervisor") 
      ? "/api/assignments" 
      : "/api/assignments/my";

    try {
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (!res.ok) {
        throw new Error("No se pudieron cargar las asignaciones de la API");
      }

      const resultado = await res.json();
      
      
      const listaAsignaciones = resultado.data || resultado || [];
      setAsignaciones(listaAsignaciones);

    } catch (err) {
      setErrorDatos(err.message);
    } finally {
      setCargandoDatos(false);
    }
  }

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  if (cargando) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  const isAdminOrSupervisor = rol === "admin" || rol === "supervisor";

  return (
    <div className="flex h-screen w-full flex-col bg-zinc-50 font-sans text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
      
      
      <div className="flex-1 overflow-y-auto">
        <main className="mx-auto max-w-7xl p-6 md:p-8">
          
          <div className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
              Estado de Controles Activos
            </h1>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Métricas e historial de los procesos en ejecución persistidos en MongoDB.
            </p>
          </div>

          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            
            
            <div className="group rounded-xl border border-zinc-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Model: Assignment</span>
              <h3 className="mt-2 text-3xl font-extrabold tracking-tight">
                {isAdminOrSupervisor ? "Asignaciones Totales" : "Mis Pendientes"}
              </h3>
              
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="inline-flex items-center rounded bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-950/40 dark:text-amber-400">pending</span>
                <span className="inline-flex items-center rounded bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-950/40 dark:text-blue-400">in_progress</span>
              </div>
              
              <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
                {isAdminOrSupervisor 
                  ? "Monitoreo y filtrado por prioridad (low | medium | high) y correo del colaborador."
                  : "Listado de checklists individuales asignados pendientes de ejecución técnica hoy."}
              </p>
            </div>

            {/* CARD 2: Model Executions */}
            <div className="group rounded-xl border border-zinc-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400">Model: Execution</span>
                <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              </div>
              <h3 className="mt-2 text-3xl font-extrabold tracking-tight">Reportes Enviados</h3>
              
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="inline-flex items-center rounded bg-green-50 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-950/40 dark:text-green-400">completed</span>
                <span className="inline-flex items-center rounded bg-purple-50 px-2 py-0.5 text-xs font-medium text-purple-800 dark:bg-purple-950/40 dark:text-purple-400">reviewed</span>
              </div>

              <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
                {isAdminOrSupervisor 
                  ? "Revisiones de progreso en tiempo real. Permite cambiar el estado de la auditoría a revisado."
                  : "Historial completo de tus ejecuciones enviadas con respuestas e ítems validados."}
              </p>
            </div>

          </div>

          {/* TABLA DE ACTIVIDAD CON DATOS REALES */}
          <div className="mt-8 rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="border-b border-zinc-200 p-5 dark:border-zinc-800">
              <h3 className="text-base font-semibold">Última actividad registrada en el Sistema</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Muestreo dinámico directo desde colecciones de la API</p>
            </div>
            
            <div className="overflow-x-auto">
              {cargandoDatos ? (
                
                <div className="flex flex-col items-center justify-center p-12 gap-2">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-500 border-t-transparent"></div>
                  <p className="text-xs text-zinc-500">Consultando base de datos...</p>
                </div>
              ) : errorDatos ? (
                <div className="p-6 text-center text-sm text-red-500">
                  ⚠️ Error al conectar con el servidor: {errorDatos}
                </div>
              ) : asignaciones.length === 0 ? (
                <div className="p-12 text-center text-sm text-zinc-500">
                  No se encontraron asignaciones registradas en este momento.
                </div>
              ) : (
                <table className="w-full text-left text-sm text-zinc-600 dark:text-zinc-400">
                  <thead className="bg-zinc-50 text-xs uppercase text-zinc-400 dark:bg-zinc-800/50">
                    <tr>
                      <th className="px-6 py-3 font-semibold">Checklist Asignado</th>
                      <th className="px-6 py-3 font-semibold">Colaborador</th>
                      <th className="px-6 py-3 font-semibold">Prioridad</th>
                      <th className="px-6 py-3 font-semibold">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                    {asignaciones.map((asig) => (
                      <tr key={asig._id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30">
                        {/* Título de la asignación */}
                        <td className="px-6 py-4 font-medium text-zinc-900 dark:text-zinc-100">
                          {asig.title || asig.checklistTitle || "Sin título"}
                        </td>
                        
                        
                        <td className="px-6 py-4 text-xs">
                          {asig.collaboratorEmail || "No asignado"}
                        </td>
                        
                        
                        <td className="px-6 py-4">
                          <span className={`text-xs font-semibold ${
                            asig.priority === "high" ? "text-red-500" : asig.priority === "medium" ? "text-amber-500" : "text-zinc-400"
                          }`}>
                            {asig.priority === "high" ? "★★☆ High" : asig.priority === "medium" ? "★☆☆ Medium" : "☆☆☆ Low"}
                          </span>
                        </td>
                        
                        
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize ${
                            asig.status === "completed" || asig.status === "reviewed"
                              ? "bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400"
                              : asig.status === "in_progress"
                              ? "bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400"
                              : "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400"
                          }`}>
                            {asig.status || "pending"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}