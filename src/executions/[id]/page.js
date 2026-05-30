import Link from 'next/link';

const API_BASE = 'https://checklist-fwabdbgzf3cvf2br.brazilsouth-01.azurewebsites.net/api/executions';

async function getExecution(id) {
  const res = await fetch(`${API_BASE}/${id}`, { next: { revalidate: 60 } });
  if (!res.ok) return null;
  return res.json();
}

export default async function ExecutionPage({ params }) {
    const { id } = params;
    const execution = await getExecution(id);
    if (!execution) {
        return (
            <div>
                <h1>Ejecución no encontrada</h1>
                <Link href="/executions">Volver al listado de ejecuciones</Link>
            </div>
        );
    }

    function toggleReviewed() {

        
    }

    return (
        <div>
            <main>
                <Link href="/executions">Volver al listado de ejecuciones</Link>
                <div>
                    <h1>Ejecución {execution.id}</h1>
                </div>
                <div>
                    <p><strong>Título del Checklist:</strong> {execution.checklistTitle}</p>
                </div>
                <div>
                    <p><strong>ID de Asignación:</strong> {execution.assignmentId}</p>
                </div>
                <div>
                    <p><strong>Estado:</strong> {execution.status}</p>
                </div>
                <div>
                    <p><strong>Email del Colaborador:</strong> {execution.collaboratorEmail}</p>
                </div>
            </main>
        </div>
    );
}