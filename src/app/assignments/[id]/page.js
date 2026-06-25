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
                            <p className="text-zinc-400 text-sm mb-1">Estado:</p>
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
                    <h2 className="text-xl font-semibold mb-4 text-white">Acciones</h2>
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
                    ) : (
                        <p className="text-zinc-400">Modo lectura. Solo el colaborador asignado puede ejecutar esta tarea.</p>
                    )}
                </div>
            </div>
        </div>
    );
}