"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ExecutionsTable({ executions }) {
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [page, setPage] = useState(initialPage);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

const filteredExecutions = executions.filter((e) => e.checklistTitle?.includes(search.toLowerCase()));

const statusFilteredExecutions = selectedStatus ? filteredExecutions.filter((execution) => e.status === selectedStatus) : filteredExecutions;

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
    <div>
        <table className="min-w-full bg-white">
            <thead>
                <tr>
                    <th className="py-2 px-4 border-b">Título del Checklist</th>
                    <th className="py-2 px-4 border-b">ID</th>
                    <th className="py-2 px-4 border-b">ID de asignación</th>
                    <th className="py-2 px-4 border-b">Estado</th>
                    <th className="py-2 px-4 border-b">Email de Colaborador</th>
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
                        <td className="py-2 px-4 border-b">{execution.id}</td>
                        <td className="py-2 px-4 border-b">{execution.assignmentId}</td>
                        <td className="py-2 px-4 border-b">{execution.status}</td>
                        <td className="py-2 px-4 border-b">{execution.collaboratorEmail}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
    </div>
    );
    
}