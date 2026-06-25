"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

const API_BASE = "https://checklist-fwabdbgzf3cvf2br.brazilsouth-01.azurewebsites.net/api/assignments";

async function getAssignments(id) {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE}/${id}`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error("Error al cargar asignación");
    }

    const body = await response.json();
    return body.data || body;
}

export default function AssignmentDetailPage() {
    const { id } = useParams();
    const router = useRouter(); 
    
    const [assignment, setAssignment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [role, setRole] = useState(null);

    const [isUpdating, setIsUpdating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const currentRole = localStorage.getItem("rol");

        if (!token) {
            setError("No autenticado. Por favor, inicia sesión.");
            setLoading(false);
            return;
        }

        setRole(currentRole);
        
        async function loadData() {
            try {
                const data = await getAssignments(id);
                setAssignment(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        if (id) {
            loadData();
        }
    }, [id]);

    async function updateStatus(newStatus) {
        if (!window.confirm(`¿Estás seguro de cambiar el estado a "${newStatus}"?`)) {
            return;
        }
        
        setIsUpdating(true);
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_BASE}/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || "Error al actualizar el estado");
            }

            // Actualizamos la vista localmente para no tener que recargar la página
            setAssignment(prev => ({ ...prev, status: newStatus }));
            
        } catch (err) {
            alert("Hubo un problema: " + err.message);
        } finally {
            setIsUpdating(false);
        }
    }

    async function deleteAssignment() {
        if (!window.confirm("¿Estás  seguro de  eliminar esta asignación? Esta acción no se puede deshacer.")) {
            return;
        }

        setIsDeleting(true);
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_BASE}/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || "Error al eliminar la asignación");
            }

            // Si se elimina correctamente, sale el usuario de esta pantalla
            alert("Asignación eliminada con éxito.");
            router.push("/assignments");
            
        } catch (err) {
            alert("Hubo un problema: " + err.message);
            setIsDeleting(false); // Solo liberamos el boton si hubo error, sino ya sale de la página
        }
    }

    if (loading) {
        return (
            <div className="p-6 text-white bg-black min-h-screen">
                <p>Cargando detalle de asignación...</p>
            </div>
        );
    }

    if (error || !assignment) {
        return (
            <div className="p-6 text-red-500 bg-black min-h-screen">
                <p>{error || "Asignación no encontrada."}</p>
                <Link href="/assignments" className="text-blue-400 underline mt-4 block">
                    Volver al listado
                </Link>
            </div>
        );
    }

    const statusMap = {
        "pending": "Pendiente",
        "in_progress": "En Progreso",
        "completed": "Completada",
        "reviewed": "Revisada"
    };

    const priorityMap = {
        "low": "Baja",
        "medium": "Media",
        "high": "Alta"
    };

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="max-w-5xl mx-auto">
                <Link href="/assignments" className="text-blue-400 hover:text-blue-300 mb-6 inline-block transition">
                    ← Volver al listado de asignaciones
                </Link>
                
                <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6 mb-8 shadow-lg">
                    <h1 className="text-3xl font-bold mb-6">Detalle de Asignación</h1>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-zinc-800 rounded-lg p-4">
                            <p className="text-zinc-400 text-sm mb-1">Título:</p>
                            <p className="font-semibold">{assignment.title}</p>
                        </div>
                        <div className="bg-zinc-800 rounded-lg p-4">
                            <p className="text-zinc-400 text-sm mb-1">Checklist Asociado:</p>
                            <p className="font-semibold">{assignment.checklistTitle}</p>
                        </div>
                        <div className="bg-zinc-800 rounded-lg p-4">
                            <p className="text-zinc-400 text-sm mb-1">Estado actual:</p>
                            <p className="font-semibold">{statusMap[assignment.status] || assignment.status}</p>
                        </div>
                        <div className="bg-zinc-800 rounded-lg p-4">
                            <p className="text-zinc-400 text-sm mb-1">Prioridad:</p>
                            <p className="font-semibold">{priorityMap[assignment.priority] || assignment.priority}</p>
                        </div>
                        <div className="bg-zinc-800 rounded-lg p-4">
                            <p className="text-zinc-400 text-sm mb-1">Email del Colaborador:</p>
                            <p className="font-semibold">{assignment.collaboratorEmail}</p>
                        </div>
                        <div className="bg-zinc-800 rounded-lg p-4">
                            <p className="text-zinc-400 text-sm mb-1">Vencimiento:</p>
                            <p className="font-semibold">
                                {assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString('es-AR') : "Sin fecha"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Panel de Acciones */}
                <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6">
                    <h2 className="text-xl font-semibold mb-4 text-white">
                        {role === "collaborator" ? "Acciones" : "Gestión de Asignación"}
                    </h2>
                    
                    {role === "collaborator" ? (
                        <div>
                            <p className="text-zinc-400 mb-4">
                                {assignment.status === "pending" 
                                    ? "Para comenzar a completar este checklist, dirigite a tu panel de ejecuciones." 
                                    : "Esta asignación ya fue iniciada o completada."}
                            </p>
                            <Link 
                                href="/executions"
                                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition shadow"
                            >
                                Ir a Mis Ejecuciones
                            </Link>
                        </div>
                    ) : (role === "admin" || role === "supervisor") ? (
                        <div className="flex flex-col md:flex-row gap-6 items-start md:items-end">
                            <div className="flex-1 w-full md:w-auto">
                                <label className="block text-zinc-400 text-sm mb-2">Modificar Estado manualmente</label>
                                <select 
                                    value={assignment.status}
                                    onChange={(e) => updateStatus(e.target.value)}
                                    disabled={isUpdating}
                                    className="w-full md:w-auto bg-zinc-800 border border-zinc-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                                >
                                    <option value="pending">Pendiente</option>
                                    <option value="in_progress">En Progreso</option>
                                    <option value="completed">Completada</option>
                                    <option value="reviewed">Revisada</option>
                                </select>
                                {isUpdating && <span className="ml-3 text-sm text-blue-400 animate-pulse">Guardando...</span>}
                            </div>
                            
                            <button 
                                onClick={deleteAssignment}
                                disabled={isDeleting}
                                className="w-full md:w-auto bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-6 py-2.5 rounded-lg font-medium transition shadow mt-4 md:mt-0"
                            >
                                {isDeleting ? "Eliminando..." : "Eliminar Asignación"}
                            </button>
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
}