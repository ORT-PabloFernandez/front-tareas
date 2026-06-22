"use client";

import { useState } from "react";
import Link from "next/link"; // 🔥 IMPORTACIÓN CORREGIDA AQUÍ

export default function UserList({ usuarios }) {
  const [search, setSearch] = useState("");

  // Usamos el excelente filtro por propiedades que ya tenías desarrollado
  const filtered = usuarios.filter((user) => {
    const nombre = user.nombre?.toLowerCase() || "";
    const username = user.username?.toLowerCase() || ""; 
    const email = user.email?.toLowerCase() || "";
    const idUnico = user._id?.toLowerCase() || ""; 
    const termino = search.toLowerCase();
    
    return (
      nombre.includes(termino) || 
      username.includes(termino) || 
      email.includes(termino) || 
      idUnico.includes(termino)
    );
  });

  return (
    <div className="space-y-4">
      {/* Buscador adaptado con Tailwind */}
      <input
        type="text"
        placeholder="Buscar por nombre, email o ID..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 dark:border-zinc-800 dark:bg-zinc-900"
      />

      {/* Grid de Tarjetas con efectos hover profesionales */}
      {filtered.length === 0 ? (
        <p className="text-center text-sm text-zinc-500 p-4">
          No se encontraron usuarios para "{search}"
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((u) => {
            const role = (u.role || u.rol || "colaborador").toLowerCase();
            const isAdmin = role === "admin";
            const isSupervisor = role === "supervisor";

            return (
              <div 
                key={u._id} 
                className="group rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
              >
                <Link href={`/user/${u._id}`} className="block space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-zinc-900 group-hover:text-blue-600 dark:text-zinc-100 dark:group-hover:text-blue-400 transition-colors">
                      {u.username || u.nombre || (u.email ? u.email.split("@")[0].replace(".", " ") : "Sin Nombre")}
                    </h3>
                    
                    {/* Badge con los mismos colores lógicos de tu estilo original */}
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize ${
                      isAdmin 
                        ? "bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-400" 
                        : isSupervisor 
                        ? "bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400" 
                        : "bg-green-100 text-green-800 dark:bg-green-950/40 dark:text-green-400"
                    }`}>
                      {role}
                    </span>
                  </div>
                  
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                    {u.email}
                  </p>
                  
                  <p className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500">
                    ID: {u._id}
                  </p>
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}