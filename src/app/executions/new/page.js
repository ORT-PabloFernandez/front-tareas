"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const API_BASE = "https://checklist-fwabdbgzf3cvf2br.brazilsouth-01.azurewebsites.net";

export default function NewExecutionPage() {
    const router = useRouter();

    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchAssignments = async () => {
            try {
                setLoading(true);
                const assigment = await fetch(`${API_BASE}/api/assigments`, {
          headers: { Authorization: `Bearer ${token}` }
        });
                if (!assignment.ok) {
                    throw new Error("Error al cargar las asignaciones");
                }
                const data = await assignment.json();
                setAssignments(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAssignments();
    }, []);

    async function handleCreateExecution(assignmentId) {
        const token = localStorage.getItem("token");

        const newExecution = {
            assignmentId: assignmentId,
            status: "in_progress",
        };

        try {
            const response = await fetch(`${API_BASE}/api/executions`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(newExecution),
            });
            if (!response.ok) {
                throw new Error("Error al crear la ejecución");
            }
            alert("¡Ejecución creada con éxito!");
            router.push("/executions");
        } catch (err) {
            setError(err.message);
        }
    }

    if (loading) {
        return (
            <div className="p-6 text-white bg-black min-h-screen">
                <p>Preparando formulario...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-3xl mx-auto">
        <Link href="/executions" className="text-blue-400 hover:text-blue-300 mb-6 inline-block transition">
          ← Volver al listado
        </Link>
        
        <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-8 shadow-lg">
          <h1 className="text-3xl font-bold mb-2">Nueva Ejecución</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form onSubmit={(e) => { e.preventDefault(); handleCreateExecution(e.target.assignmentId.value); }}>
                <label htmlFor="assignmentId" className="block mb-2">Selecciona una asignación:</label>
                <select required
                  value={assignmentId}
                  onChange={(e) => setAssignmentId(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition">
                    <option value="">-- Selecciona una asignación --</option>
                    {assignments.map((assignment) => (
                        <option key={assignment.id} value={assignment.id}>
                            {assignment.title}
                        </option>
                    ))}
                </select>
                <button type="submit" className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition">
                    Crear Ejecución
                </button>
            </form>
        </div>
    </div>
</div>
    );
}