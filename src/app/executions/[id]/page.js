"use client";
import Link from 'next/link';
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

const API_BASE = 'https://checklist-fwabdbgzf3cvf2br.brazilsouth-01.azurewebsites.net/api/executions';

async function getExecution(id) {
    const token = localStorage.getItem("token");
  const res = await fetch(`${API_BASE}/${id}`, { headers: { Authorization: `Bearer ${token}`,}, });
  console.log("Status:", res.status);

  if (!res.ok) return null;

   const result = await res.json();
    console.log("Result:", result);
  return result.data;
}

export default function ExecutionPage() {
    const { id } = useParams();
    const [execution, setExecution] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadExecution() {
      const data = await getExecution(id);

      setExecution(data);
      setLoading(false);
    }

    if (id) {
      loadExecution();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="p-6 text-white">
        <h1>Cargando ejecución...</h1>
      </div>
    );
  }
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
                <h1>Detalle de Ejecución</h1>
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
                <div>
                    <p><strong>Fecha de Inicio:</strong> {new Date(execution.startedAt).toLocaleString()}</p>
                </div>
                <div>
                    <p><strong>Fecha de Finalización:</strong> {execution.completedAt ? new Date(execution.completedAt).toLocaleString() : "N/A"}</p>
                </div>
                <div>
                    <p><strong>Revisado:</strong> {execution.reviewed ? "Sí" : "No"}</p>
                </div>
                <div>
                    <p><strong>Fecha de Creacion:</strong> {execution.createdAt ? new Date(execution.createdAt).toLocaleString() : "N/A"}</p>
                </div>
                <div>
                    <p><strong>Ultimo Cambio:</strong> {execution.updatedAt ? new Date(execution.updatedAt).toLocaleString() : "N/A"}</p>
                </div>
            </main>
            <div>
                <h2>Respuestas:</h2>
                <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3">Pregunta</th>
                <th className="text-left py-3">Respuesta</th>
                <th className="text-left py-3">Válida</th>
                <th className="text-left py-3">Completada</th>
              </tr>
            </thead>

            <tbody>
              {Object.entries(execution.responses).map(
                ([questionId, response]) => (
                  <tr
                    key={questionId}
                    className="border-b border-gray-800"
                  >
                    <td className="py-3">{questionId}</td>

                    <td className="py-3">
                      {String(response.value)}
                    </td>

                    <td className="py-3">
                      {response.valid ? "✅" : "❌"}
                    </td>

                    <td className="py-3">
                      {new Date(
                        response.completedAt
                      ).toLocaleString("es-AR")}
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
            </div>
        </div>
        
    );
}