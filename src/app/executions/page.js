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
  return localStorage.getItem("rol");
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
  const [role, setRole] = useState(null);
  const [email, setEmail] = useState(null);
  const [emailFilter, setEmailFilter] = useState("");
  const [typedEmail, setTypedEmail] = useState("");
  const [isSessionReady, setIsSessionReady] = useState(false);

  useEffect(() => {
    setRole(localStorage.getItem("rol"));
    setEmail(localStorage.getItem("usuario"));
    setIsSessionReady(true);
  }, []);

  useEffect(() => {
    if (!isSessionReady) return;
    async function loadExecutions() {
      try {
        setLoading(true);
        let collaboratorEmail = null;
        if (role === "collaborator") {
          collaboratorEmail = email;
        }
        if (role === "supervisor" && emailFilter) {
        collaboratorEmail = emailFilter;
      }
        const data = await getExecutions(page, collaboratorEmail);
        setExecutions(data.data);
        console.log("DATA:", data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadExecutions();
  }, [page, role, email, emailFilter, isSessionReady]);
  if (!isSessionReady || loading) {
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
          value={typedEmail}
          onChange={(e) => setTypedEmail(e.target.value)}
          placeholder="Filtrar por email"
          className="border p-2 rounded"
        />
        <button
          onClick={() => setEmailFilter(typedEmail)}
          className="ml-2 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
        >
          Buscar
        </button>
        <button
          onClick={() => {setTypedEmail("");
          setEmailFilter("");
          }}
          className="ml-2 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
        >
          Limpiar filtro
        </button>
      </div>
    )}
    {role === "collaborator" && (
      <link href="/executions/new" className="mb-4 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
        + Nueva Ejecución
      </link>)}
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