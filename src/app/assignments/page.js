"use client";

import { useEffect, useState } from "react";
import Link from "next/link"

const ASSIGNMENTS_ENDPOINT = "https://checklist-fwabdbgzf3cvf2br.brazilsouth-01.azurewebsites.net/api/assignments";

async function getMyAssignments() {

    const token = localStorage.getItem("token");
    const response = await fetch(ASSIGNMENTS_ENDPOINT, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error("Error al cargar asignaciones");
    }

    const body = await response.json();
    return body.data || body;
}

async function getAllAssignments(collaboratorEmail = "", status = "") {
    const token = localStorage.getItem("token");
    let url = ASSIGNMENTS_ENDPOINT;
    const params = new URLSearchParams();
    if (collaboratorEmail) {
        params.append("collaboratorEmail", collaboratorEmail);
    }
    if (status) {
        params.append("status", status);

    }
    if (params.toString()) {
        url += `?${params.toString()}`;
    }
    const response = await fetch(url, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    });
    if (!response.ok) {
        throw new Error("Error al cargar asignaciones");
    }
    const body = await response.json();
    return body.data || body;
}

export default function AssignmentsPage() {
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [role, setRole] = useState(null);

    useEffect(() => {
        const currentRole = localStorage.getItem("role");
        setRole(currentRole);

        async function loadAssignments() {
            try {
                let data;
                if (currentRole === "collaborator") {
                    data = await getMyAssignments();
                } else {
                    data = await getAllAssignments();
                }
                setAssignments(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        loadAssignments();
    }, []);

    if (loading) {
        return (
            <div className="p-6 text-white bg-black min-h-screen">
                <p>Cargando asignaciones...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 text-red-500 bg-black min-h-screen">
                <p>Error: {error}</p>
            </div>
        );
    }

    return (
        <div className="bg-black min-h-screen text-white">
            <main className="p-8 max-w-7xl mx-auto">
                <div className="mb-8 flex justify-between items-center">
                 <div>   
                    <Link href="/" className="text-zinc-400 hover:text-white transition">
                        Volver al inicio
                    </Link>
                    <h1 className="text-3xl font-bold">
                        {role === "collaborator" ? "Mis Asignaciones" : "Gestión de Asignaciones"}
                    </h1>
                </div>
                
                {(role === "admin" || role === "supervisor") && (
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium transition">
              + Nueva Asignación
            </button>
                )}
                </div>

                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                    <p className="text-zinc-400 mb-4">
                        Se cargaron {assignments.length} asignaciones.
                    </p>
                    {/* <AssignmentsTable assignments={assignments} /> */}
                </div>
            </main>
        </div>
    );
} 