"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const API_URL = "https://checklist-fwabdbgzf3cvf2br.brazilsouth-01.azurewebsites.net";

export default function Usuario() {
  const [usuarios, setUsuarios] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function obtenerUsuarios() {
      try {
        const token = localStorage.getItem("token");
        
        const res = await fetch(`${API_URL}/api/users`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (!res.ok) {
          throw new Error("No se pudo obtener la lista de usuarios");
        }

        const respuestaData = await res.json();
        // Guardamos los usuarios (manejando el formato de éxito del README)
        setUsuarios(respuestaData.data || respuestaData || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    }

    obtenerUsuarios();
  }, []);

  // Filtrado en tiempo real por nombre, username, email o ID
  const usuariosFiltrados = usuarios.filter((user) => {
    const nombre = user.nombre?.toLowerCase() || "";
    const username = user.username?.toLowerCase() || ""; // <-- Agregado para filtrar por username también
    const email = user.email?.toLowerCase() || "";
    const idUnico = user._id?.toLowerCase() || ""; 
    
    const termino = busqueda.toLowerCase();
    
    // Retorna verdadero si coincide con cualquiera de los campos
    return (
      nombre.includes(termino) || 
      username.includes(termino) || 
      email.includes(termino) || 
      idUnico.includes(termino)
    );
  });

  if (cargando) return <p style={estilos.centrado}>Cargando usuarios...</p>;
  if (error) return <p style={{ ...estilos.centrado, color: "#ef4444" }}>Error: {error}</p>;

  return (
    <div style={estilos.contenedor}>
      {/* BARRA DE BÚSQUEDA */}
      <div style={estilos.buscadorContenedor}>
        <input
          type="text"
          placeholder="Buscar por nombre, email o ID..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          style={estilos.inputBuscador}
        />
      </div>

      {/* TABLA DE USUARIOS */}
      <div style={estilos.tablaContenedor}>
        <table style={estilos.tabla}>
          <thead>
            <tr style={estilos.cabeceraTabla}>
              <th style={estilos.celdaCabecera}>Nombre</th>
              <th style={estilos.celdaCabecera}>Email</th>
              <th style={estilos.celdaCabecera}>Rol</th>
              <th style={estilos.celdaCabecera}>ID</th>
            </tr>
          </thead>
          <tbody>
            {usuariosFiltrados.length > 0 ? (
              usuariosFiltrados.map((user) => (
                <tr key={user._id} style={estilos.filaTabla}>
                  <td style={estilos.celda}>
                    {/* Vinculamos el nombre a la ruta dinámica /user/id_del_usuario */}
                    <Link 
                      href={`/user/${user._id}`} 
                      style={{ color: "#2b4bee", textDecoration: "none", fontWeight: "600" }}
                    >
                      {/* Muestra primero username, si no nombre, si no formatea el email */}
                      {user.username || user.nombre || (user.email ? user.email.split("@")[0].replace(".", " ") : "Sin Nombre")}
                    </Link>
                  </td>
                  <td style={estilos.celda}>{user.email}</td>
                  <td style={estilos.celda}>
                    <span style={estilos.badge(user.role || "colaborador")}>
                      {user.role || "colaborador"}
                    </span>
                  </td>
                  <td style={{ ...estilos.celda, color: "#64748b", fontSize: 12 }}>
                    {user._id}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={estilos.sinResultados}>
                  No se encontraron usuarios para "{busqueda}"
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Estilos limpios y profesionales
const estilos = {
  contenedor: { width: "100%", padding: "20px 0", marginTop: 16 },
  buscadorContenedor: { marginBottom: 20 },
  inputBuscador: { width: "100%", padding: "12px 16px", border: "1px solid #cbd5e1", borderRadius: 8, fontSize: 16, fontWeight: "normal" },
  tablaContenedor: { background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" },
  tabla: { width: "100%", borderCollapse: "collapse", textAlign: "left" },
  cabeceraTabla: { background: "#f8fafc", borderBottom: "1px solid #e2e8f0" },
  celdaCabecera: { padding: "14px 16px", fontWeight: "600", color: "#475569", fontSize: 14 },
  filaTabla: { borderBottom: "1px solid #f1f5f9" },
  celda: { padding: "14px 16px", color: "#334155", fontSize: 15, fontWeight: "normal" },
  sinResultados: { padding: 24, textAlign: "center", color: "#64748b", fontWeight: "normal" },
  centrado: { textAlign: "center", marginTop: 20, fontSize: 16, color: "#64748b" },
  badge: (role) => {
    const r = role.toLowerCase();
    const isAdmin = r === "admin";
    const isSupervisor = r === "supervisor";
    return {
      padding: "4px 8px",
      borderRadius: 6,
      fontSize: 12,
      fontWeight: "500",
      textTransform: "capitalize",
      background: isAdmin ? "#fee2e2" : isSupervisor ? "#fef3c7" : "#dcfce7",
      color: isAdmin ? "#991b1b" : isSupervisor ? "#92400e" : "#166534",
    };
  }
};