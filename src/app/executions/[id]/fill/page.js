"use client";

import { useEffect, useState } from "react";
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
      try {
        const token = localStorage.getItem("token");
        
        const executionRes = await fetch(`${API_BASE}/${id}`, { 
          headers: { Authorization: `Bearer ${token}` } 
        });
        const executionData = await executionRes.json();
        setExecution(executionData);

        const assignmentRes = await fetch(`https://checklist-fwabdbgzf3cvf2br.brazilsouth-01.azurewebsites.net/api/assignments/${executionData.assignmentId}`, { 
          headers: { Authorization: `Bearer ${token}` } 
        });
        const assignmentData = await assignmentRes.json();
        setAssignment(assignmentData); 

        const checklistRes = await fetch(`https://checklist-fwabdbgzf3cvf2br.brazilsouth-01.azurewebsites.net/api/checklists/6a15043255503bccecaf0291`, { 
          headers: { Authorization: `Bearer ${token}` } 
        });
        const checklistData = await checklistRes.json();
        let checklistActual = checklistData.data ? checklistData.data : checklistData;
      if (Array.isArray(checklistActual)) {
        checklistActual = checklistActual[0];
      }
        console.log("👉 CHECKLIST ENCONTRADA EN AZURE:", checklistActual);
        setChecklist(checklistActual);

      const initialResponses = {};
      if (checklistActual && checklistActual.items) {
        checklistActual.items.forEach(item => {
          initialResponses[item.id] = {
            value: "",
            valid: true,
            visible: true,
            completedAt: null
          };
        });
      }
        
        setResponses(initialResponses);
        setLoading(false);
      } catch (error) {
        console.error("Error cargando los datos:", error);
        setLoading(false);
      }
    };

    if (id) loadData();
  }, [id]);

  const handleValueChange = (itemId, value) => {
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

  const handleSubmit = async (e) => {

    e.preventDefault();

    const token = localStorage.getItem("token");

    const responsesArray = Object.keys(responses).map((key) => ({
    itemId: key,
    value: responses[key].value,
  }));

    const updatedExecution = {
      responses: responsesArray
    };

    console.log("🚀 Enviando ejecución modificada y limpia a Azure:", updatedExecution);
    try {
      const response = await fetch(`${API_BASE}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json", 
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedExecution),
      });

      console.log("Status Code del servidor:", response.status);
    
    const resData = await response.json();
    console.log("💬 Respuesta del servidor Azure:", resData);

    if (response.ok) {
      alert("¡Inspección guardada con éxito!");
      router.push("/executions");
    } else {
      console.error("❌ El servidor rechazó los datos:", resData.message || resData.error);
      alert(`Error al guardar: ${resData.message || "Revisá la consola"}`);
    }
    } catch (error) {
      console.error("Error al enviar la ejecución final:", error);
    }
  };

  if (loading) return <div className="text-white p-6 bg-gray-955 min-h-screen">Cargando formulario dinámico...</div>;
  if (!execution) return <div className="text-white p-6 bg-gray-955 min-h-screen">No se pudieron cargar los datos.</div>;

  return (
    <div className="min-h-screen bg-gray-950 py-10 px-4">
      <div className="max-w-2xl mx-auto p-6 bg-gray-900 text-white rounded-xl border border-gray-800 shadow-2xl">
        
        {/* Cabecera del Formulario con Datos del Checklist Fijo */}
        <div className="mb-6 border-b border-gray-800 pb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase bg-yellow-950 text-yellow-400 px-2 py-0.5 rounded border border-yellow-800">
              {execution.status}
            </span>
            <span className="text-xs font-bold uppercase bg-blue-950 text-blue-400 px-2 py-0.5 rounded border border-blue-800">
              {checklist.category}
            </span>
          </div>
          <h2 className="text-2xl font-bold mt-2 text-white">{checklist.title}</h2>
          <p className="text-sm text-gray-400 mt-1">{checklist.description}</p>
          <div className="text-xs text-gray-500 mt-3 flex flex-col gap-0.5">
            <span>Colaborador en campo: {execution.collaboratorEmail || "Asignado"}</span>
            <span>ID de ejecución: {execution._id}</span>
          </div>
        </div>

        {/* Formulario Dinámico de Campos Fijos */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-5">
            {checklist.items?.map((item) => (
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
                    placeholder="Escribe las observaciones aquí..."
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
                    placeholder="Introduce el valor numérico..."
                  />
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