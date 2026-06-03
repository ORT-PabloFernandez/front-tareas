"use client";
import Link from 'next/link';
import ExecutionsTable from './components/ExecutionsTable';
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

const EXECUTIONS_ENDPOINT = 'https://checklist-fwabdbgzf3cvf2br.brazilsouth-01.azurewebsites.net/api/executions';

const LIMIT = 20;

async function getExecutions(page, email) {
  const token = localStorage.getItem("token");
  let url = `${EXECUTIONS_ENDPOINT}?page=${page}&limit=${LIMIT}`;
  if (email) {
    url += `&collaboratorEmail=${email}`;
  }
  const res = await fetch(url, {headers: { Authorization: `Bearer ${token}`,}, next: { revalidate: 60 } });
   console.log("STATUS:", res.status);

  const body = await res.text();
  console.log("BODY:", body);

  if (!res.ok) {
    throw new Error("No se pudo obtener el listado de ejecuciones");
  }

  return JSON.parse(body);
}

export function getRole() {
  return localStorage.getItem("role");
}

export function getEmail() {
  return localStorage.getItem("email");
}

export default function ExecutionsPage() {
  const searchParams = useSearchParams();
  const pageParam = searchParams.get("page");
  const page = Math.max(1, parseInt(pageParam) || 1);
  const [executions, setExecutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [emailFilter, setEmailFilter] = useState("");
  const role = getRole();

  useEffect(() => {
    async function loadExecutions() {
      try {
        let email = null;
        if (role === "collaborator") {
          email = getEmail();
        }
        if (role === "supervisor" && emailFilter) {
        collaboratorEmail = emailFilter;
      }
        const data = await getExecutions(page, email);
        setExecutions(data.data);
        console.log("DATA:", data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadExecutions();
  }, [page, role]);
  if (loading) {
    return (
      <div className="p-6 text-white">
        <h1>Cargando ejecuciones...</h1>
      </div>
    );
  }
  const hasNext = executions.length === LIMIT;

  return (
    <div>
      <main>
      <div>
        <Link href="/">Volver al inicio</Link>
        <h1>Listado de Ejecuciones</h1>
      </div>
      {role === "supervisor" && (
      <div className="mb-4">
        <input
          type="email"
          value={emailFilter}
          onChange={(e) => setEmailFilter(e.target.value)}
          placeholder="Filtrar por email"
          className="border p-2 rounded"
        />
      </div>
    )}
      <ExecutionsTable executions={executions} />
      {page > 1 ? (
            <Link
              href={`/executions?page=${page - 1}`}
              className="rounded-full border border-white/20 px-5 py-2 text-sm font-semibold transition hover:border-white/50 hover:bg-white/5"
            >
              ← Anterior
            </Link>
          ) : (
            <span />
          )}
          <span className="text-sm text-zinc-500">Página {page}</span>
          {hasNext ? (
            <Link
              href={`/executions?page=${page + 1}`}
              className="rounded-full border border-white/20 px-5 py-2 text-sm font-semibold transition hover:border-white/50 hover:bg-white/5"
            >
              Siguiente →
            </Link>
          ) : (
            <span />
          )}
      </main>
      </div>
  );
}