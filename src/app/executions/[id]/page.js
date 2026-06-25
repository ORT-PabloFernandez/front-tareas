"use client";
import Link from 'next/link';
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";

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
    const router = useRouter();

    const statusMapping = {
    "pending": "Pendiente",
    "in_progress": "En Progreso",
    "completed": "Completada",
    "reviewed": "Revisada"
  };

  useEffect(() => {
    setRole(localStorage.getItem("rol"));
    async function loadExecution() {
      const data = await getExecution(id);

      setExecution(data);
      setResponses(data.responses || {});
      setLoading(false);
      setNotes(data.notes || "");
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

    const prepareResponsesPayload = () => {
    return Object.keys(responses).map((key) => ({
      itemId: responses[key].itemId || key,
      value: responses[key].value
    }));
  };

    async function handleReview() {
    try {
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

      if (!res.ok) throw new Error("Error en la revisión");

      alert("Ejecución marcada como revisada.");
      const updated = await getExecution(id);
      if (updated) setExecution(updated);
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

async function handleComplete() {
    try {
      const token = localStorage.getItem("token");
      const responsesArray = prepareResponsesPayload();

      const res = await fetch(`${API_BASE}/${id}/complete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          responses: responsesArray,
          notes: notes || "Inspección completada sin anomalías detectadas"
        }),
      });

      if (res.ok) {
        alert("¡Inspección finalizada y cerrada con éxito!");
        router.push("/executions");
      } else {
        const errData = await res.json();
        alert(`Error al completar: ${errData.message || "Verificá los datos"}`);
      }
    } catch (error) {
      console.error("Error al completar la ejecución:", error);
    }
  }

    

    return (
        <div className="min-h-screen bg-black text-white p-8">
          <div className="max-w-5xl mx-auto">
            <main>
                <Link href="/executions" className="text-blue-400 hover:text-blue-300 mb-6 inline-block">Volver al listado de ejecuciones</Link>
                <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6 mb-8 shadow-lg">
                <h1 className="text-3xl font-bold mb-6">Detalle de Ejecución</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-zinc-800 rounded-lg p-4">
                    <p className="text-zinc-400 text-sm"><strong>Título del Checklist:</strong> {execution.checklistTitle}</p>
                </div>
                <div className="bg-zinc-800 rounded-lg p-4">
                    <p className="text-zinc-400 text-sm"><strong>ID de Asignación:</strong> {execution.assignmentId}</p>
                </div>
                <div className="bg-zinc-800 rounded-lg p-4">
                    <p className="text-zinc-400 text-sm"><strong>Estado:</strong> {statusMapping[execution.status] || execution.status}</p>
                </div>
                <div className="bg-zinc-800 rounded-lg p-4">
                    <p className="text-zinc-400 text-sm"><strong>Email del Colaborador:</strong> {execution.collaboratorEmail}</p>
                </div>
                <div className="bg-zinc-800 rounded-lg p-4">
                    <p className="text-zinc-400 text-sm"><strong>Fecha de Inicio:</strong> {new Date(execution.startedAt).toLocaleString()}</p>
                </div>
                <div className="bg-zinc-800 rounded-lg p-4">
                    <p className="text-zinc-400 text-sm"><strong>Fecha de Finalización:</strong> {execution.completedAt ? new Date(execution.completedAt).toLocaleString() : "N/A"}</p>
                </div>
                <div className="bg-zinc-800 rounded-lg p-4">
                    <p className="text-zinc-400 text-sm"><strong>Revisado:</strong> {execution.status === "reviewed" ? "Sí" : "No"}</p>
                </div>
                <div className="bg-zinc-800 rounded-lg p-4">
                    <p className="text-zinc-400 text-sm"><strong>Fecha de Creacion:</strong> {execution.createdAt ? new Date(execution.createdAt).toLocaleString() : "N/A"}</p>
                </div>
                <div className="bg-zinc-800 rounded-lg p-4">
                    <p className="text-zinc-400 text-sm"><strong>Ultimo Cambio:</strong> {execution.updatedAt ? new Date(execution.updatedAt).toLocaleString() : "N/A"}</p>
                </div>
                </div>
                </div>
            </main>
            <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6 mb-8">
                <h2>Respuestas:</h2>
                <div className="overflow-x-auto">
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
            <div>
              {role == "collaborator" && execution.status === "in_progress" && (
                <>
                <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6 mb-6">
                <h3 className="text-xl font-semibold mb-4">
                 Notas
                </h3>
                <textarea
                  placeholder="Agregar notas..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
                <button
                  onClick={handleSaveProgress}
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-medium"
                >
                  Guardar Progreso
                </button>
                </div>
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
            <div className="flex gap-4 flex-wrap">
              {role == "supervisor" && execution.status !== "reviewed" && (
                <button
                  onClick={handleReview}
                  className="bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded-lg font-medium"
                >
                  Marcar como revisado
                </button>
              )}
            </div>
            <div>
              {role == "collaborator" && execution.status === "in_progress" && (
                <button
                  onClick={handleComplete}
                  className="bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded-lg font-medium"
                >
                  Marcar como completado
                </button>
              )}
            </div>
        </div>
        </div>
        
    );
}