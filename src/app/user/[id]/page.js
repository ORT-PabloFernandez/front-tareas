"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

const API_URL = "https://checklist-fwabdbgzf3cvf2br.brazilsouth-01.azurewebsites.net";

export default function UserDetailPage() {
  const { id } = useParams();
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    async function getUsuario() {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      console.log("DATA:", data);
      setUsuario(data.data || data);
    }
    getUsuario();
  }, [id]);

  return (
    <div>
      <h1>Detalle del usuario {usuario?.username}</h1>
    </div>
  );
}