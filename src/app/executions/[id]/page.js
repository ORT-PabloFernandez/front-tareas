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
    const [role, setRole] = useState(null);
    const [responses, setResponses] = useState({});
    const [notes, setNotes] = useState("");

  useEffect(() => {
    setRole(localStorage.getItem("role"));
    async function loadExecution() {
      const data = await getExecution(id);

      setExecution(data);
      setResponses(data.responses || {});
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

    async function toggleReviewed(id) {

      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        status: "reviewed",
      }),
    });

      if (!res.ok) {
        throw new Error("Error al actualizar el estado de revisión");
      }

      const updatedExecution = await res.json();
      setExecution(updatedExecution.data);

        
    }

    async function handleReview() {
    try {
      const updated = await toggleReviewed(id);

      setExecution(updated.data);
    } catch (error) {
      console.error(error);
    }
  }

  async function saveProgress(id, responses, notes) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_BASE}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      responses,
      notes,
    }),
  });

  return await res.json();
}

async function handleSaveProgress() {
    try {
      const updated = await saveProgress(
        id,
        responses,
        notes
      );

      setExecution(updated.data);
    } catch (error) {
      console.error(error);
    }
  }

async function completeExecution(id, responses, notes) {
  const token = localStorage.getItem("token");

  const res = await fetch(
    `${API_BASE}/${id}/complete`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        responses,
        notes,
      }),
    }
  );

  return await res.json();
}

async function handleComplete() {
    try {
      const updated = await completeExecution(
        id,
        responses,
        notes
      );

      setExecution(updated.data);
    } catch (error) {
      console.error(error);
    }
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
                    <p><strong>Revisado:</strong> {execution.status === "reviewed" ? "Sí" : "No"}</p>
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
            <div>
              {role == "collaborator" && execution.status === "in_progress" && (
                <>
                <textarea
                  placeholder="Agregar notas..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
                <button
                  onClick={handleSaveProgress}
                >
                  Guardar Progreso
                </button>
                </>
              )}
            </div>
            <div>
              {role == "admin" && execution.status === "completed" && (
                <button
                 onClick={handleReview}
                >
                  Marcar como revisado
                </button>
              )}
            </div>
            <div>
              {role == "supervisor" && execution.status === "completed" && (
                <button
                  onClick={handleReview}
                >
                  Marcar como revisado
                </button>
              )}
            </div>
            <div>
              {role == "collaborator" && execution.status === "in_progress" && (
                <button
                  onClick={handleComplete}
                >
                  Marcar como completado
                </button>
              )}
            </div>
        </div>
        
    );
}