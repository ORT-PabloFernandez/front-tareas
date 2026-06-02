"use client";

import { useState, useEffect } from "react";

const API_URL = "https://checklist-fwabdbgzf3cvf2br.brazilsouth-01.azurewebsites.net";

export default function Usuario() {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function getUsuarios() {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(`${API_URL}/api/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Error al traer los usuarios");

        const data = await res.json();
        setUsuarios(data.data || data);
      } catch (err) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    }

    getUsuarios();
  }, []);

  if (cargando) return <p>Cargando usuarios...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: "16px", fontFamily: "sans-serif" }}>
      <h2>Lista de Registrados</h2>
      {usuarios.map((u) => (
        <div key={u._id} style={{ border: "1px solid #e2e8f0", borderRadius: 8, padding: 12, marginBottom: 8 }}>
          <p><strong>Nombre:</strong> {u.username || u.nombre}</p>
          <p><strong>Email:</strong> {u.email}</p>
          <p><strong>Rol:</strong> {u.role || u.rol}</p>
        </div>
      ))}
    </div>
  );
}