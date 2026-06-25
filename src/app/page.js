import Link from "next/link";


const ASIGNACIONES_SISTEMA = [
  { 
    _id: "65f1a2b3c4d5e6f7a8b9c001", 
    title: "Auditoría de Servidores Críticos", 
    collaboratorEmail: "Nestor.Wilke@ejemplo.com", 
    priority: "high", 
    status: "in_progress",
    checklistTitle: "Seguridad Informática v1"
  },
  { 
    _id: "65f1a2b3c4d5e6f7a8b9c002", 
    title: "Control de Calidad - Línea A", 
    collaboratorEmail: "colaborador2@ort.edu.ar", 
    priority: "medium", 
    status: "pending",
    checklistTitle: "Checklist Operativo Planta"
  },
  { 
    _id: "65f1a2b3c4d5e6f7a8b9c003", 
    title: "Mantenimiento Preventivo Redes", 
    collaboratorEmail: "Nestor.Wilke@ejemplo.com", 
    priority: "low", 
    status: "completed",
    checklistTitle: "Infraestructura Base"
  },
  { 
    _id: "65f1a2b3c4d5e6f7a8b9c004", 
    title: "Validación de Protocolos de Incendio", 
    collaboratorEmail: "seguridad@empresa.com", 
    priority: "high", 
    status: "reviewed",
    checklistTitle: "Higiene y Seguridad"
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans">
      <main className="mx-auto flex max-w-5xl flex-col items-start gap-8 px-6 py-16 sm:px-10">
        
        
        <div className="space-y-3">
          
          <h1 className="text-4xl font-extrabold leading-tight text-white md:text-5xl">
            Sistema de Checklists Operativos
          </h1>
          <p className="max-w-3xl text-lg text-zinc-400 leading-relaxed">
            Aplicación orientada a la gestión de templates, asignaciones y ejecuciones en tiempo real mediante arquitectura en capas. Conexión integrada con un control de acceso por roles (Admin, Supervisor y Colaborador).
          </p>
        </div>

        <hr className="w-full border-zinc-800 my-4" />

        
        <div className="w-full space-y-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-bold tracking-tight">Últimas asignaciones registradas en el sistema</h2>
            <p className="text-sm text-zinc-500">Muestreo inicial de los documentos de la colección asignados a colaboradores.</p>
          </div>

          <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/30 backdrop-blur-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-zinc-400">
                <thead className="bg-zinc-900/80 text-xs uppercase tracking-wider text-zinc-500 border-b border-zinc-800">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Título / Template</th>
                    <th className="px-6 py-4 font-semibold">Colaborador</th>
                    <th className="px-6 py-4 font-semibold">Prioridad</th>
                    <th className="px-6 py-4 font-semibold">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {ASIGNACIONES_SISTEMA.map((asig) => (
                    <tr key={asig._id} className="hover:bg-zinc-900/20 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-zinc-200">{asig.title}</div>
                        <div className="text-xs text-zinc-500 mt-0.5">{asig.checklistTitle}</div>
                      </td>
                      <td className="px-6 py-4 text-xs font-mono text-zinc-400">{asig.collaboratorEmail}</td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-semibold ${
                          asig.priority === "high" ? "text-red-400" : asig.priority === "medium" ? "text-amber-400" : "text-zinc-500"
                        }`}>
                          {asig.priority === "high" ? "★★☆ High" : asig.priority === "medium" ? "★☆☆ Medium" : "☆☆☆ Low"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                          asig.status === "completed" || asig.status === "reviewed"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : asig.status === "in_progress"
                            ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                            : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        }`}>
                          {asig.status.replace("_", " ")}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        

      </main>
    </div>
  );
}