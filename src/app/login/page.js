"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const API_URL = "https://checklist-fwabdbgzf3cvf2br.brazilsouth-01.azurewebsites.net";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setCargando(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/api/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email, password })
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Usuario o contraseña incorrectos");
      }

      const data = await res.json();
      console.log("Login exitoso, datos recibidos:", data);
      
      // 1. Guardamos todo en el localStorage de forma única
      localStorage.setItem("token", data.token);
      localStorage.setItem("usuario", data.data?.nombre || data.user?.nombre || email);
      
      const userRole = data.data?.role || data.role || data.user?.role || "colaborador";
      localStorage.setItem("rol", userRole); 

      // 2. Disparamos el evento para que el Header se entere en tiempo real
      window.dispatchEvent(new Event("cambioAuth"));

      // 3. Redireccionamos fluidamente al Home
      router.push("/");

    } catch (error) {
      setError(error.message);
    } finally {
      setCargando(false);
    }
  }

  return (
    <section style={estilos.section}>
      <h1 style={{ marginBottom: 16 }}>Iniciar sesión</h1>

      <form onSubmit={handleSubmit} style={estilos.form}>
        <label style={estilos.label}>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={estilos.input}
          />
        </label>

        <label style={estilos.label}>
          Contraseña
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={estilos.input}
          />
        </label>

        <button type="submit" disabled={cargando} style={estilos.boton}>
          {cargando ? "Ingresando..." : "Ingresar"}
        </button>

        {error && <p style={{ color: "#ef4444" }}>{error}</p>}
      </form>

      <p style={{ marginTop: 16, textAlign: "center" }}>
        ¿No tenés cuenta?{" "}
        <Link href="/register" style={{ color: "#2b4bee" }}>
          Registrarme
        </Link>
      </p>
    </section>
  );
}

const estilos = {
  section: { maxWidth: 420, margin: "0 auto", padding: 24 },
  form: { display: "flex", flexDirection: "column", gap: 12, background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 24 },
  label: { display: "flex", flexDirection: "column", gap: 4, fontSize: 14, color: "#334155" },
  input: { padding: "10px 12px", border: "1px solid #cbd5e1", borderRadius: 8, fontSize: 16 },
  boton: { marginTop: 8, padding: "10px 16px", background: "#2b4bee", color: "#fff", border: "none", borderRadius: 8, fontSize: 16, cursor: "pointer" },
};