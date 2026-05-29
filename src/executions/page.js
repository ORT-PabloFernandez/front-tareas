import Link from 'next/link';
import ExecutionsTable from './components/ExecutionsTable';

const EXECUTIONS_ENDPOINT = 'https://checklist-fwabdbgzf3cvf2br.brazilsouth-01.azurewebsites.net/api/executions';

const LIMIT = 20;

async function getExecutions(page) {
  const url = `${EXECUTIONS_ENDPOINT}?page=${page}&limit=${LIMIT}`;
  const res = await fetch(url, { next: { revalidate: 60 } });
  if (!res.ok) {
    throw new Error("No se pudo obtener el listado de ejecuciones");
  }
  return res.json();
}

export default async function ExecutionsPage({ searchParams }) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam) || 1);
  const executions = await getExecutions(page);
  const hasNext = executions.length === LIMIT;

  return (
    <div>
      <main>
      <div>
        <Link href="/">Volver al inicio</Link>
        <h1>Listado de Ejecuciones</h1>
      </div>
      <ExecutionsTable executions={executions} />
      </main>
      </div>
  );
}