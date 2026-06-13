"use client";

import { useEffect, useState, use } from "react";
import { useRouter, useParams } from "next/navigation";

const API_BASE = 'https://checklist-fwabdbgzf3cvf2br.brazilsouth-01.azurewebsites.net/api/executions';

export default function FillExecution() {
  const router = useRouter();
  const { id } = useParams();
  const [execution, setExecution] = useState(null);
  const [assignment, setAssignment] = useState(null);
  const [checklist, setChecklist] = useState(null);
  const [checklistItems, setChecklistItems] = useState([]);
  const [responses, setResponses] = useState({});
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      const token = localStorage.getItem("token");
      const executionRes = await fetch(`${API_BASE}/${id}`, { headers: { Authorization: `Bearer ${token}`,}, });

      const executionData = await executionRes.json();

      setExecution(executionData);

      const assignmentRes = await fetch(`https://checklist-fwabdbgzf3cvf2br.brazilsouth-01.azurewebsites.net/api/assignments/${executionData.assignmentId}`, { headers: { Authorization: `Bearer ${token}`,}, });
      const assignmentData = await assignmentRes.json();

      const checklistRes = await fetch(`https://checklist-fwabdbgzf3cvf2br.brazilsouth-01.azurewebsites.net/api/checklists/${assignmentData.checklistId}`, { headers: { Authorization: `Bearer ${token}`,}, });
      const checklistData = await checklistRes.json();
      setChecklist(checklistData);
    };

    const initialResponses = {};
        checklistData.items.forEach(item => {
          initialResponses[item.id] = {
            value: item.type === "checkbox" ? false : "",
            valid: true,
            visible: true,
            completedAt: null
          };
        });
        setResponses(initialResponses);
        setLoading(false);

    loadData();
  }, [id]);

  const handleResponseChange = (itemId, value) => {
    setResponses((prev) => ({
      ...prev,
      [itemId]: {
        value,
        valid: true,
        visible: true,
        completedAt: new Date().toISOString(),
      },
    }));
  };

  const handleSubmit = async () => {

    const updatedExecution = {
      ...execution,
      responses: responses,
      status: "completed", // Transición de estado automática
      completedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    await fetch(`${API_BASE}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedExecution),
    });

    router.push("/executions");
  };

  if (!execution) return <div>Cargando...</div>;

  return (
    <div className="min-h-screen bg-gray-950 py-10 px-4">
      <div className="max-w-2xl mx-auto p-6 bg-gray-900 text-white rounded-xl border border-gray-800 shadow-2xl">
        
        {/* Cabecera del Formulario */}
        <div className="mb-6 border-b border-gray-800 pb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase bg-yellow-950 text-yellow-400 px-2 py-0.5 rounded border border-yellow-800">
              {execution.status}
            </span>
            {assignment?.priority && (
              <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded border ${
                assignment.priority === 'high' ? 'bg-red-950 text-red-400 border-red-800' : 'bg-gray-800 text-gray-400 border-gray-700'
              }`}>
                Prioridad: {assignment.priority}
              </span>
            )}
          </div>
          <h2 className="text-2xl font-bold mt-2 text-white">{checklist.title}</h2>
          <p className="text-sm text-gray-400 mt-1">{checklist.description}</p>
          <div className="text-xs text-gray-500 mt-3 flex flex-col gap-0.5">
            <span>Colaborador: {execution.collaboratorEmail}</span>
            <span>Asignación ID: {execution.assignmentId}</span>
          </div>
        </div>

        {/* Formulario Dinámico */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-5">
            {checklist.items.map((item) => (
              <div key={item.id} className="bg-gray-800/60 p-4 rounded-lg border border-gray-700/60 hover:border-gray-700 transition-colors">
                <label className="block text-sm font-semibold mb-2 text-gray-200">
                  {item.text} {item.required && <span className="text-red-500">*</span>}
                </label>

                {/* TIPO: TEXT */}
                {item.type === "text" && (
                  <input
                    type="text"
                    value={responses[item.id]?.value || ""}
                    onChange={(e) => handleValueChange(item.id, e.target.value)}
                    required={item.required}
                    className="w-full p-2.5 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-green-500 transition-colors"
                    placeholder="Escribe tu respuesta aquí..."
                  />
                )}

                {/* TIPO: NUMBER */}
                {item.type === "number" && (
                  <input
                    type="number"
                    value={responses[item.id]?.value || ""}
                    onChange={(e) => handleValueChange(item.id, e.target.value === "" ? "" : Number(e.target.value))}
                    required={item.required}
                    className="w-full p-2.5 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-green-500 transition-colors"
                    placeholder="Introduce un valor numérico..."
                  />
                )}

                {/* TIPO: CHECKBOX */}
                {item.type === "checkbox" && (
                  <div className="flex items-center gap-3 mt-1">
                    <input
                      type="checkbox"
                      id={`check-${item.id}`}
                      checked={!!responses[item.id]?.value}
                      onChange={(e) => handleValueChange(item.id, e.target.checked)}
                      className="w-5 h-5 rounded bg-gray-700 border-gray-600 text-green-600 focus:ring-green-500 focus:ring-offset-gray-900"
                    />
                    <label htmlFor={`check-${item.id}`} className="text-sm text-gray-400 select-none cursor-pointer">
                      Confirmar cumplimiento de este ítem
                    </label>
                  </div>
                )}

                {/* TIPO: SELECT */}
                {item.type === "select" && (
                  <select
                    value={responses[item.id]?.value || ""}
                    onChange={(e) => handleValueChange(item.id, e.target.value)}
                    required={item.required}
                    className="w-full p-2.5 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-green-500 transition-colors"
                  >
                    <option value="">-- Selecciona una opción --</option>
                    {item.options?.map((opt, idx) => (
                      <option key={idx} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            ))}
          </div>

          {/* Botones de acción inferior */}
          <div className="flex justify-end gap-4 pt-4 border-t border-gray-800">
            <button
              type="button"
              onClick={() => router.push("/executions")}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded text-gray-300 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-green-600 hover:bg-green-700 rounded font-bold transition-colors shadow-lg active:scale-95 transform"
            >
              Finalizar Ejecución
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}