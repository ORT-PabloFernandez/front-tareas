"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from "./HeaderNew.module.css";

export default function HeaderNew() {
  const [usuario, setUsuario] = useState(null);
  const [rol, setRol] = useState(null); 
  const router = useRouter();

  useEffect(() => {
    function revisarEstadoAuth() {
      const token = localStorage.getItem("token");
      const usuarioGuardado = localStorage.getItem("usuario");
      const rolGuardado = localStorage.getItem("rol"); 

      if (token && usuarioGuardado) {
        setRol(rolGuardado ? rolGuardado.toLowerCase() : "collaborator");

        if (usuarioGuardado.includes("@")) {
          const nombreLimpio = usuarioGuardado.split("@")[0]; 
          const nombreFormateado = nombreLimpio.replace(".", " "); 
          setUsuario(nombreFormateado);
        } else {
          setUsuario(usuarioGuardado);
        }
      } else {
        setUsuario(null);
        setRol(null);
      }
    }

    revisarEstadoAuth();
    window.addEventListener("cambioAuth", revisarEstadoAuth);

    return () => {
      window.removeEventListener("cambioAuth", revisarEstadoAuth);
    };
  }, []);

  function cerrarSesion() {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    localStorage.removeItem("rol"); 
    setUsuario(null);
    setRol(null);
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

        {/* 🛠️ CONDICIÓN 1: Solo muestra el menú de navegación si el usuario está logueado */}
        {usuario && (
          <nav className={styles["header-new__nav"]}>
            {rol === "admin" || rol === "supervisor" ? (
              <>
                <Link href="/user" className={styles["header-new__nav-link"]}>
                  Usuarios
                </Link>
                <Link href="/templates" className={styles["header-new__nav-link"]}>
                  Templates
                </Link>
                <Link href="/assignments" className={styles["header-new__nav-link"]}>
                  Asignaciones
                </Link>
                <Link href="/executions" className={styles["header-new__nav-link"]}>
                  Ejecuciones a Aprobar
                </Link>
              </>
            ) : (
              <>
                <Link href="/asignaciones" className={styles["header-new__nav-link"]}>
                  Mis Asignaciones
                </Link>
                <Link href="/executions" className={styles["header-new__nav-link"]}>
                  Mis Ejecuciones
                </Link>
              </>
            )}
          </nav>
        )}
      </div>

      <div className={styles["header-new__right"]}>
        {/* 🛠️ CONDICIÓN 2: Solo muestra el buscador y las notificaciones si el usuario inició sesión */}
        {usuario && (
          <>
            <div className={styles["header-new__search"]}>
              <span className={`material-symbols-outlined ${styles["header-new__search-icon"]}`}>
                search
              </span>
              <input
                className={styles["header-new__search-input"]}
                placeholder="Buscar..."
                type="text"
              />
            </div>

            <div className={styles["header-new__actions"]}>
              <button className={styles["header-new__action-btn"]}>
                <span className="material-symbols-outlined">notifications</span>
              </button>
              <button className={styles["header-new__action-btn"]}>
                <span className="material-symbols-outlined">settings</span>
              </button>
            </div>
          </>
        )}

        {/* BLOQUE DE USUARIO / LOGIN */}
        {usuario ? (
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ color: "#334155", fontSize: 14, textTransform: "capitalize" }}>
              Hola, {usuario}
            </span>
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
              className={styles["header-new__avatar"]}
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=60"
              alt="Profile picture"
              style={{ width: '35px', height: '35px', borderRadius: '50%' }}
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