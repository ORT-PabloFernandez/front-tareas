"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AssignmentsTable({ assignments }) {
  // se guardan los estados que escribe el usuario en los filtros de búsqueda y estado
    const [search, setSearch] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");
    const router = useRouter();

    // Buscar por título de asignación o título de checklist, si está vacío se muestra todo
    const filteredAssignments = assignments.filter(assignment => {
        
        if (!search) return true;

        const searchLower = search.toLowerCase();
        const titleMatch = assignment.title?.toLowerCase().includes(searchLower);
        const checklistTitleMatch = assignment.checklistTitle?.toLowerCase().includes(searchLower);

        return titleMatch || checklistTitleMatch;
        
    });

    // Filtrar por estado sobre la búsqueda
    const statusFilteredAssignments = selectedStatus
        ? filteredAssignments.filter(a => a.status === selectedStatus)
        : filteredAssignments;
    
    const statusMapping = {
        "pending": "Pendiente",
        "in_progress": "En Progreso",
        "completed": "Completada",
        "reviewed": "Revisada"
    };

    const priorityMapping = {
        "low": "Baja",
        "medium": "Media",
        "high": "Alta"
    };

    return (
    <div>
      {/* Controles de Filtro y Búsqueda */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)} // se actualiza el estado de búsqueda cada vez que el usuario escribe
          placeholder="Buscar por título o checklist..."
          className="p-2 border border-gray-700 bg-gray-800 text-white rounded flex-grow"
        />
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="p-2 border border-gray-700 bg-gray-800 text-white rounded w-full md:w-48"
        >
          <option value="">Todos los estados</option>
          <option value="pending">Pendiente</option>
          <option value="in_progress">En Progreso</option>
          <option value="completed">Completada</option>
          <option value="reviewed">Revisada</option>
        </select>
      </div>

        {/* Tabla de Asignaciones */}
        <div className="overflow-x-auto rounded-xl border border-gray-800 shadow-lg">
        <table className="min-w-full bg-gray-900 text-gray-100 text-sm">
          <thead>
            <tr className="bg-gray-800 text-gray-300 uppercase">
              <th className="py-3 px-4 text-left border-b border-gray-700">Título</th>
              <th className="py-3 px-4 text-left border-b border-gray-700">Checklist</th>
              <th className="py-3 px-4 text-left border-b border-gray-700">Colaborador</th>
              <th className="py-3 px-4 text-left border-b border-gray-700">Prioridad</th>
              <th className="py-3 px-4 text-left border-b border-gray-700">Estado</th>
              <th className="py-3 px-4 text-left border-b border-gray-700">Vencimiento</th>
            </tr>
          </thead>
          <tbody>
            {statusFilteredAssignments.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-8 text-center text-gray-500">
                  No se encontraron asignaciones con esos filtros.
                </td>
              </tr>
            ) : (
              // se itera assignments para generar las filas de la tabla dinámicamente
              statusFilteredAssignments.map((assignment) => (
                <tr 
                  key={assignment._id} 
                  className="border-b border-gray-800 hover:bg-gray-800 transition cursor-pointer"
                  onClick={() => router.push(`/assignments/${assignment._id}`)} // lleva a la pagían de detalle luego de hacer click
                >
                  <td className="py-3 px-4 font-semibold text-white">
                    {assignment.title}
                  </td>
                  <td className="py-3 px-4 text-gray-400">{assignment.checklistTitle}</td>
                  <td className="py-3 px-4">{assignment.collaboratorEmail}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      assignment.priority === 'high' ? 'bg-red-900 text-red-200' :
                      assignment.priority === 'medium' ? 'bg-yellow-900 text-yellow-200' :
                      'bg-green-900 text-green-200'
                    }`}>
                      {priorityMapping[assignment.priority] || assignment.priority}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {statusMapping[assignment.status] || assignment.status}
                  </td>
                  <td className="py-3 px-4">
                    {assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString('es-AR') : "N/A"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
        
}