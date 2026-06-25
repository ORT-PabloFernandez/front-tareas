"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const API_URL = "https://checklist-fwabdbgzf3cvf2br.brazilsouth-01.azurewebsites.net";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  
  const [verificando, setVerificando] = useState(true);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [ok, setOk] = useState(false);

 
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/");
    } else {
      setVerificando(false);
    }
  }, [router]);

  async function handleSubmit(e) {
    e.preventDefault();
    setCargando(true);
    setError("");
    setOk(false);

    try {
      const res = await fetch(`${API_URL}/api/users/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: name, email, password })
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "No se pudo registrar el usuario");
      }

      setOk(true);
      setName("");
      setEmail("");
      setPassword("");
    } catch (error) {
      setError(error.message);
    } finally {
      setCargando(false);
    }
  }

  
  if (verificando) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-4 py-12 font-sans dark:bg-zinc-950">
      <div className="w-full max-w-md">
        
       
        <div className="mb-6 text-center">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 font-bold text-white shadow-sm mb-4">
            ✓
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Crear cuenta
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Regístrate para comenzar a gestionar tus checklists operativos
          </p>
        </div>

       
        <form 
          onSubmit={handleSubmit} 
          className="flex flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
        >
          
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Nombre
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Tu nombre completo"
              className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm outline-none transition-all focus:border-blue-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-950 dark:focus:border-blue-500 dark:focus:bg-zinc-950"
            />
          </div>

          
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="ejemplo@correo.com"
              className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm outline-none transition-all focus:border-blue-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-950 dark:focus:border-blue-500 dark:focus:bg-zinc-950"
            />
          </div>

         
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={4}
              placeholder="Mínimo 4 caracteres"
              className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm outline-none transition-all focus:border-blue-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-950 dark:focus:border-blue-500 dark:focus:bg-zinc-950"
            />
          </div>

          
          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-xs font-medium text-red-600 dark:bg-red-950/30 dark:text-red-400">
              ⚠️ {error}
            </div>
          )}

          {ok && (
            <div className="rounded-lg bg-green-50 p-3 text-xs font-medium text-green-700 dark:bg-green-950/30 dark:text-green-400">
              ✨ ¡Cuenta creada con éxito! Ya podés iniciar sesión.
            </div>
          )}

          
          <button 
            type="submit" 
            disabled={cargando} 
            className="mt-2 flex w-full items-center justify-center rounded-lg bg-blue-600 py-2.5 text-sm font-medium text-white transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {cargando ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
            ) : (
              "Registrarme"
            )}
          </button>
        </form>

        
        <p className="mt-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
          ¿Ya tenés cuenta?{" "}
          <Link href="/login" className="font-semibold text-blue-600 hover:underline dark:text-blue-400">
            Iniciar sesión
          </Link>
        </p>

      </div>
    </div>
  );
}