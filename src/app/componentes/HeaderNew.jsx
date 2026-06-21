"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./HeaderNew.module.css";

const API_URL = "https://checklist-fwabdbgzf3cvf2br.brazilsouth-01.azurewebsites.net";

export default function HeaderNew() {
  const [usuario, setUsuario] = useState(null);
  const [rol, setRol] = useState(null); 
  
  
  const [notificaciones, setNotificaciones] = useState([]);
  const [mostrarDropdown, setMostrarDropdown] = useState(false);
  const [cargandoNotif, setCargandoNotif] = useState(false);

  useEffect(() => {
    async function revisarEstadoAuth() {
      
      const token = localStorage.getItem("token");
      const usuarioGuardado = localStorage.getItem("usuario");
      const rolGuardado = localStorage.getItem("rol"); 

      if (token && usuarioGuardado) {
        const rolFormateado = rolGuardado ? rolGuardado.toLowerCase() : "collaborator";
        setRol(rolFormateado);

        
        if (usuarioGuardado.includes("@")) {
          const nombreLimpio = usuarioGuardado.split("@")[0]; 
          const nombreFormateado = nombreLimpio.replace(".", " "); 
          setUsuario(nombreFormateado);
        } else {
          setUsuario(usuarioGuardado);
        }

        
        await consultarAlertasDesdeAPI(rolFormateado, token);

      } else {
        
        setUsuario(null);
        setRol(null);
        setNotificaciones([]);
      }
    }

   
    revisarEstadoAuth();

   
    window.addEventListener("cambioAuth", revisarEstadoAuth);
    
   
    window.addEventListener("pageshow", revisarEstadoAuth);

    return () => {
      window.removeEventListener("cambioAuth", revisarEstadoAuth);
      window.removeEventListener("pageshow", revisarEstadoAuth);
    };
  }, []);

  
  async function consultarAlertasDesdeAPI(currentRol, token) {
    setCargandoNotif(true);
    try {
      if (currentRol === "admin" || currentRol === "supervisor") {
        
        const res = await fetch(`${API_URL}/api/executions`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (res.ok) {
          const data = await res.json();
          const todasLasExec = data.data || [];
          
          
          const pendientesDeRevision = todasLasExec.filter(e => e.status === "completed");
          
          const formatoAlertas = pendientesDeRevision.map((e) => ({
            id: e._id || Math.random().toString(),
            texto: `📥 Ejecución de "${e.checklistTitle}" por ${e.collaboratorEmail} requiere aprobación.`
          }));
          setNotificaciones(formatoAlertas);
        }
      } else {
        
        const res = await fetch(`${API_URL}/api/assignments/my`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.ok) {
          const data = await res.json();
          const misAsignaciones = data.data || [];
          
          // Filtramos solo las asignaciones nuevas que no empezó
          const nuevasAsignaciones = misAsignaciones.filter(a => a.status === "pending");
          
          const formatoAlertas = nuevasAsignaciones.map((a) => ({
            id: a._id || Math.random().toString(),
            texto: `📅 Tienes asignado el checklist: "${a.title || a.checklistTitle}"`
          }));
          setNotificaciones(formatoAlertas);
        }
      }
    } catch (err) {
      console.error("Error al traer notificaciones de Azure:", err);
    } finally {
      setCargandoNotif(false);
    }
  }

  function cerrarSesion() {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    localStorage.removeItem("rol"); 
    setUsuario(null);
    setRol(null);
    setNotificaciones([]);
    window.location.href = "/login";
  }

  return (
    <header className={styles["header-new"]}>
      <div className={styles["header-new__left"]}>
        <Link href="/" className={styles["header-new__logo"]}>
          <Image 
            src="/logo-v2.png" 
            alt="TaskFlow Logo"
            width={70} 
            height={70}  
            priority 
            style={{ 
              width: '70px', 
              height: '70px', 
              display: 'block',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '2px solid #000000' 
            }}
          />
          <h2 className={styles["header-new__logo-text"]}>TaskFlow</h2>
        </Link>

        {usuario && (
          <nav className={styles["header-new__nav"]}>
            
            <Link href="/user" className={styles["header-new__nav-link"]}>Usuarios</Link>

            {rol === "admin" || rol === "supervisor" ? (
              <>
                <Link href="/assignments" className={styles["header-new__nav-link"]}>Asignaciones</Link>
                <Link href="/executions" className={styles["header-new__nav-link"]}>Ejecuciones</Link>
              </>
            ) : (
              <>
                <Link href="/asignaciones" className={styles["header-new__nav-link"]}>Mis Asignaciones</Link>
                <Link href="/executions" className={styles["header-new__nav-link"]}>Mis Ejecuciones</Link>
              </>
            )}
          </nav>
        )}
      </div>

      <div className={styles["header-new__right"]}>
        {usuario && (
          <>
            <div className={styles["header-new__actions"]} style={{ position: "relative" }}>
              
              
              <button 
                className={styles["header-new__action-btn"]}
                onClick={() => setMostrarDropdown(!mostrarDropdown)}
                style={{ position: "relative" }}
              >
                <span className="material-symbols-outlined">notifications</span>
                {notificaciones.length > 0 && (
                  <span style={{
                    position: "absolute",
                    top: "-2px",
                    right: "-2px",
                    background: "#ef4444",
                    color: "white",
                    borderRadius: "50%",
                    fontSize: "10px",
                    width: "16px",
                    height: "16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold"
                  }}>
                    {notificaciones.length}
                  </span>
                )}
              </button>

              
              {mostrarDropdown && (
                <div style={{
                  position: "absolute",
                  top: "45px",
                  right: "0",
                  width: "290px",
                  background: "#fff",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  borderRadius: "8px",
                  border: "1px solid #e2e8f0",
                  zIndex: 100,
                  padding: "8px 0"
                }}>
                  <div style={{ padding: "8px 16px", fontWeight: "bold", borderBottom: "1px solid #f1f5f9", fontSize: "14px", color: "#1e293b" }}>
                    Notificaciones Recientes
                  </div>
                  <div style={{ maxHeight: "250px", overflowY: "auto" }}>
                    {cargandoNotif ? (
                      <p style={{ padding: "16px", fontSize: "13px", color: "#64748b", textAlign: "center", margin: 0 }}>
                        Buscando actualizaciones...
                      </p>
                    ) : notificaciones.length === 0 ? (
                      <p style={{ padding: "16px", fontSize: "13px", color: "#64748b", textAlign: "center", margin: 0 }}>
                        No tienes tareas pendientes de revisión.
                      </p>
                    ) : (
                      notificaciones.map((notif) => (
                        <div 
                          key={notif.id} 
                          style={{ 
                            padding: "12px 16px", 
                            fontSize: "13px", 
                            color: "#334155", 
                            borderBottom: "1px solid #f1f5f9",
                            cursor: "pointer",
                            transition: "background 0.2s"
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f8fafc"}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                        >
                          {notif.texto}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        
        {usuario ? (
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            
            
            <div style={{ display: "flex", flexDirection: "column", lineHeight: "1.2" }}>
              <span style={{ color: "#334155", fontSize: 14, fontWeight: "600", textTransform: "capitalize" }}>
                Hola, {usuario}
              </span>
              {rol && (
                <span style={{ color: "#64748b", fontSize: 11, fontWeight: "500", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  {rol}
                </span>
              )}
            </div>

            <button
              onClick={cerrarSesion}
              style={{
                padding: "6px 12px",
                background: "#ef4444",
                color: "#fff",
                border: "none",
                borderRadius: 6,
                fontSize: 12,
                cursor: "pointer",
              }}
            >
              Cerrar sesión
            </button>
            <img
              src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
              alt="Profile picture"
              style={{ width: '40px', height: '40px', borderRadius: '50%' }}
            />
          </div>
        ) : (
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <Link href="/login" style={{ color: "#2b4bee", fontSize: 14, textDecoration: "none" }}>
              Ingresar
            </Link>
            <Link href="/register" style={{ color: "#2b4bee", fontSize: 14, textDecoration: "none" }}>
              Registrarme
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}