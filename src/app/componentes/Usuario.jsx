"use client";

import { useEffect, useState } from "react";
import UserList from "./UserList"; 

const API_URL = "https://checklist-fwabdbgzf3cvf2br.brazilsouth-01.azurewebsites.net";

export default function Usuario() {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function obtenerUsuarios() {
      try {
        let token = localStorage.getItem("token");
        
        if (!token) {
          throw new Error("No se encontró el token. Por favor, inicia sesión nuevamente.");
        }

        if (token.startsWith("Bearer ")) {
          token = token.slice(7).trim();
        }
        
        // Primer intento con Bearer estándar
        const res = await fetch(`${API_URL}/api/users`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        // Segundo intento con token plano si falla
        if (res.status === 401) {
          console.warn("Fallo con 'Bearer', intentando enviar el token plano...");
          const resSegundoIntento = await fetch(`${API_URL}/api/users`, {
            method: "GET",
            headers: {
              "Authorization": token, 
              "Content-Type": "application/json"
            }
          });

          if (resSegundoIntento.ok) {
            const respuestaData = await resSegundoIntento.json();
            setUsuarios(respuestaData.data || respuestaData || []);
            return; 
          }
        }

        if (!res.ok) {
          let mensajeBackend = "";
          try {
            const errorData = await res.json();
            mensajeBackend = errorData.message || JSON.stringify(errorData);
          } catch {
            mensajeBackend = "El servidor denegó el acceso.";
          }
          throw new Error(`Código ${res.status}: ${mensajeBackend}`);
        }

        const respuestaData = await res.json();
        setUsuarios(respuestaData.data || respuestaData || []);
      } catch (err) {
        console.error("Error al obtener la lista de usuarios:", err);
        setError(err.message);
      } finally {
        setCargando(false);
      }
    }

    obtenerUsuarios();
  }, []);

  if (cargando) {
    return (
      <div className="flex justify-center p-12">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600 dark:bg-red-950/30 dark:text-red-400 text-center">
        ⚠️ Error: {error}
      </div>
    );
  }

  // Estructura idéntica al código del profesor: Pasa el array limpio como prop
  return <UserList usuarios={usuarios} />;
}