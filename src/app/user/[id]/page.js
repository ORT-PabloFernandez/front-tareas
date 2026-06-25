"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

const API_URL = "https://checklist-fwabdbgzf3cvf2br.brazilsouth-01.azurewebsites.net";

export default function UserDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function getUsuario() {
      try {
        const token = localStorage.getItem("token");
        
        const res = await fetch(`${API_URL}/api/users/${id}`, {
          headers: { 
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
        });
        
        if (!res.ok) throw new Error("Error al obtener el detalle");

        const data = await res.json();
        console.log("DATA RECIBIDA DE AZURE:", data);
        
        
        setUsuario(data.data || data);
      } catch (error) {
        console.error("Fallo en el detalle:", error);
      } finally {
        setCargando(false);
      }
    }

    if (id) {
      getUsuario();
    }
  }, [id]);

  if (cargando) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 p-6 font-sans dark:bg-zinc-950 flex flex-col items-center justify-center">
      <div className="w-full max-w-md rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        
       
        <button 
          onClick={() => router.back()}
          className="mb-4 text-xs font-medium text-blue-600 hover:underline dark:text-blue-400 block"
        >
          ← Volver a la lista
        </button>

        <div className="border-b border-zinc-100 pb-4 dark:border-zinc-800">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Información del Perfil</span>
          
          <h1 className="mt-1 text-xl font-bold capitalize text-zinc-900 dark:text-zinc-50">
            {usuario?.username || usuario?.nombre || "Usuario Registrado"}
          </h1>
        </div>

        
        <div className="mt-4 space-y-3 text-sm">
          <p className="text-zinc-600 dark:text-zinc-400">
            <strong className="text-zinc-900 dark:text-zinc-100">Email corporativo:</strong> {usuario?.email || "No especificado"}
          </p>
          
          <p className="text-zinc-600 dark:text-zinc-400 flex items-center gap-2">
            <strong className="text-zinc-900 dark:text-zinc-100">Rol del Sistema:</strong> 
            <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium capitalize text-blue-700 dark:bg-blue-950/40 dark:text-blue-400">
              {usuario?.role || usuario?.rol || "colaborador"}
            </span>
          </p>

          <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800">
            <p className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500">
              ID Unico: {usuario?._id || id}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}