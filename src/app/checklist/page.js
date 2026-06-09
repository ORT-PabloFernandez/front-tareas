"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL ||
  "https://checklist-fwabdbgzf3cvf2br.brazilsouth-01.azurewebsites.net";

export default function ChecklistPage() {
  const router = useRouter();
  const [checklists, setChecklists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const storedToken = window.localStorage.getItem("token");
    setToken(storedToken || "");
  }, []);

  useEffect(() => {
    if (!token) return;
    fetchChecklists();
  }, [token]);

  async function fetchChecklists() {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/api/checklists`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json().catch(() => ({}));

      if (res.status === 401) {
        window.localStorage.removeItem("token");
        setToken("");
        router.push("/login");
        return;
      }

      if (!res.ok) {
        throw new Error(data.message || "No se pudo obtener la lista de checklists.");
      }

      setChecklists(Array.isArray(data.data) ? data.data : data.data || data || []);
    } catch (fetchError) {
      setError(fetchError.message || "Error al cargar los checklists.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section style={estilos.section}>
      <div style={estilos.header}>
        <div>
          <h1 style={estilos.title}>Checklist</h1>
          <p style={estilos.subtitle}>
            checklists.
          </p>
        </div>
        <Link href="/" style={estilos.link}>Volver al inicio</Link>
      </div>

      {!token ? (
        <div style={estilos.card}>
          <p>Para ver los checklists necesitás iniciar sesión.</p>
          <Link href="/login" style={estilos.button}>Iniciar sesión</Link>
        </div>
      ) : (
        <>
          <div style={estilos.actionRow}>
            <button onClick={fetchChecklists} style={estilos.button} disabled={loading}>
              {loading ? "Cargando..." : "Actualizar checklist"}
            </button>
          </div>

          {error && <p style={estilos.error}>{error}</p>}

          {loading && !error ? (
            <p>Cargando checklists...</p>
          ) : checklists.length === 0 ? (
            <div style={estilos.card}>
              <p>No hay checklists disponibles.</p>
            </div>
          ) : (
            <div style={estilos.grid}>
              {checklists.map((checklist) => (
                <div key={checklist._id || checklist.id || checklist.title} style={estilos.card}>
                  <h2 style={estilos.cardTitle}>{checklist.title || checklist.name || "Checklist sin título"}</h2>
                  <p style={estilos.cardMeta}>
                    <strong>Categoría:</strong> {checklist.category || "No definida"}
                  </p>
                  <p style={estilos.cardDescription}>{checklist.description || "Sin descripción."}</p>
                  <p style={estilos.cardMeta}>
                    <strong>Items:</strong> {Array.isArray(checklist.items) ? checklist.items.length : 0}
                  </p>

                  {Array.isArray(checklist.items) && checklist.items.length > 0 && (
                    <div style={estilos.itemList}>
                      {checklist.items.map((item, index) => (
                        <div key={item.id || index} style={estilos.item}>
                          <span style={estilos.itemIndex}>{index + 1}.</span>
                          <div>
                            <p style={estilos.itemText}>{item.text || "Ítem sin texto"}</p>
                            <p style={estilos.itemType}>Tipo: {item.type || "desconocido"}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}

const estilos = {
  section: {
    maxWidth: 980,
    margin: "0 auto",
    padding: 24,
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 16,
    marginBottom: 24,
    flexWrap: "wrap",
  },
  title: {
    margin: 0,
    fontSize: 32,
    lineHeight: 1.1,
  },
  subtitle: {
    margin: "8px 0 0",
    color: "#475569",
    maxWidth: 640,
  },
  link: {
    color: "#2563eb",
    textDecoration: "none",
    fontWeight: 600,
  },
  actionRow: {
    display: "flex",
    justifyContent: "flex-end",
    marginBottom: 20,
  },
  grid: {
    display: "grid",
    gap: 20,
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  },
  card: {
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: 16,
    padding: 20,
    boxShadow: "0 10px 20px rgba(15, 23, 42, 0.06)",
  },
  cardTitle: {
    margin: "0 0 12px",
    fontSize: 20,
  },
  cardMeta: {
    margin: "0 8px 12px",
    color: "#64748b",
    fontSize: 14,
  },
  cardDescription: {
    margin: "0 0 16px",
    color: "#334155",
    lineHeight: 1.6,
  },
  itemList: {
    marginTop: 12,
    display: "grid",
    gap: 12,
  },
  item: {
    display: "flex",
    gap: 12,
    padding: 12,
    background: "#f8fafc",
    borderRadius: 12,
    border: "1px solid #e2e8f0",
  },
  itemIndex: {
    fontWeight: 700,
    color: "#0f172a",
  },
  itemText: {
    margin: 0,
    fontWeight: 600,
  },
  itemType: {
    margin: "4px 0 0",
    color: "#475569",
    fontSize: 13,
  },
  button: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "10px 16px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    cursor: "pointer",
    textDecoration: "none",
    fontWeight: 600,
  },
  error: {
    color: "#b91c1c",
    marginBottom: 16,
  },
};
