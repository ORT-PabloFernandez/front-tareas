"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ExecutionsTable({ executions }) {
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

const filteredExecutions = executions.filter((e) => e.checklistTitle?.toLowerCase().includes(search.toLowerCase()));

const statusFilteredExecutions = selectedStatus ? filteredExecutions.filter((execution) => execution.status === selectedStatus) : filteredExecutions;

return (
    <div>
        <div>
        <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por título del checklist"
            className="mb-4 p-2 border border-gray-300 rounded"
            />
        <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="mb-4 p-2 border border-gray-300 rounded"
            >
            <option value="">Todos los estados</option>
            <option value="completed">Completado</option>
            <option value="in_progress">En progreso</option>
            <option value="reviewed">Revisado</option>
            </select>
    </div>
    <div className="overflow-x-auto rounded-xl border border-gray-800 shadow-lg">
        <table className="min-w-full bg-gray-900 text-gray-100">
            <thead>
                <tr className="bg-gray-800 text-gray-300 uppercase text-sm">
                    <th className="py-2 px-4 border-b">Título del Checklist</th>
                    <th className="py-2 px-4 border-b">Estado</th>
                    <th className="py-2 px-4 border-b">Email de Colaborador</th>
                    <th className="py-2 px-4 border-b">Inicio</th>
                    <th className="py-2 px-4 border-b">Finalización</th>
                    </tr>
            </thead>
            <tbody>
                {statusFilteredExecutions.map((execution) => (
                    <tr key={execution.id}>
                        <td className="px-6 py-4 font-semibold text-white">
                  <button
                    type="button"
                    className="block text-left text-inherit"
                    onClick={() => router.push(`/executions/${execution._id}`)}
                    
                  >
                    {execution.checklistTitle}
                  </button>
                </td>
                        <td className="py-2 px-4 border-b">{execution.status}</td>
                        <td className="py-2 px-4 border-b">{execution.collaboratorEmail}</td>
                        <td className="py-2 px-4 border-b">{new Date(execution.startedAt).toLocaleString()}</td>
                        <td className="py-2 px-4 border-b">{execution.completedAt ? new Date(execution.completedAt).toLocaleString() : "N/A"}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
    </div>
    );
    
}