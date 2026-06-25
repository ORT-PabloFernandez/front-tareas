"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const API_BASE = "https://checklist-fwabdbgzf3cvf2br.brazilsouth-01.azurewebsites.net";

export default function NewAssignmentPage() {
  const router = useRouter();
  
  // Estados para los datos de la API (para los selectores)
  const [checklists, setChecklists] = useState([]);
  const [users, setUsers] = useState([]);
  
  // Estados para el formulario
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [checklistId, setChecklistId] = useState("");
  const [collaboratorEmail, setCollaboratorEmail] = useState("");
  
  // Estados de la vista
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadFormDependencies() {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No estás autenticado.");
        setLoading(false);
        return;
      }

      try {
        // 1. Traer Checklists
        const checkRes = await fetch(`${API_BASE}/api/checklists`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const checkData = await checkRes.json();
        setChecklists(checkData.data || checkData || []);

        // 2. Traer Usuarios (para elegir al colaborador)
        const userRes = await fetch(`${API_BASE}/api/users`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const userData = await userRes.json();
        
        // Filtramos para mostrar solo los que tienen rol collaborator
        const allUsers = userData.data || userData || [];
        const collaborators = allUsers.filter(u => u.role === "collaborator" || u.rol === "collaborator");
        setUsers(collaborators.length > 0 ? collaborators : allUsers); // Si no hay colaboradores puros, mostramos todos por las dudas

      } catch (err) {
        setError("Error al cargar los datos necesarios para el formulario.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadFormDependencies();
  }, []);

  // función que ataja el envío del formulario, hace la llamada a la API y redirige a la tabla de asignaciones
  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const token = localStorage.getItem("token");

    const newAssignment = {
      title,
      description,
      priority,
      checklistId,
      collaboratorEmail
    };

    try {
      const res = await fetch(`${API_BASE}/api/assignments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newAssignment)
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Error al crear la asignación");
      }

      alert("¡Asignación creada con éxito!");
      router.push("/assignments"); // Volvemos a la tabla

    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
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
        <Link href="/assignments" className="text-blue-400 hover:text-blue-300 mb-6 inline-block transition">
          ← Volver al listado
        </Link>
        
        <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-8 shadow-lg">
          <h1 className="text-3xl font-bold mb-2">Nueva Asignación</h1>
          <p className="text-zinc-400 mb-8">Completá los datos para asignar un checklist a un colaborador.</p>
          
          {error && (
            <div className="bg-red-950/50 border border-red-900 text-red-400 p-4 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Título */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-zinc-300 mb-2">Título de la tarea</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ej: Inspección Sector Norte"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition"
                />
              </div>

              {/* Checklist */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Checklist a ejecutar</label>
                <select
                  required
                  value={checklistId}
                  onChange={(e) => setChecklistId(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition"
                >
                  <option value="">Seleccioná un checklist...</option>
                  {checklists.map(chk => (
                    <option key={chk._id || chk.id} value={chk._id || chk.id}>
                      {chk.title || chk.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Colaborador */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Asignar a (Colaborador)</label>
                <select
                  required
                  value={collaboratorEmail}
                  onChange={(e) => setCollaboratorEmail(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition"
                >
                  <option value="">Seleccioná un empleado...</option>
                  {users.map(u => (
                    <option key={u._id} value={u.email}>
                      {u.username || u.nombre} ({u.email})
                    </option>
                  ))}
                </select>
              </div>

              {/* Prioridad */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Prioridad</label>
                <select
                  required
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition"
                >
                  <option value="low">Baja</option>
                  <option value="medium">Media</option>
                  <option value="high">Alta</option>
                </select>
              </div>

              {/* Descripción */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-zinc-300 mb-2">Descripción (Opcional)</label>
                <textarea
                  rows="3"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detalles adicionales sobre esta tarea..."
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition resize-none"
                ></textarea>
              </div>

            </div>

            <div className="pt-6 border-t border-zinc-800 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:opacity-50 text-white px-6 py-3 rounded-lg font-bold transition shadow-lg"
              >
                {saving ? "Guardando..." : "Crear Asignación"}
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}