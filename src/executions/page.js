import Link from 'next/link';

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