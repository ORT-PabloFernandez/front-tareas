"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from "./HeaderNew.module.css";

export default function HeaderNew() {
  const [usuario, setUsuario] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const nombre = localStorage.getItem("usuario");
    if (token && nombre) {
      setUsuario(nombre);
    }
  }, []);

  function cerrarSesion() {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    setUsuario(null);
    router.push("/login");
  }

  return (
    <header className={styles["header-new"]}>
      <div className={styles["header-new__left"]}>
        <Link href="/" className={styles["header-new__logo"]}>
  {/* Ponemos la imagen en lugar del 'span' de antes */}
  <Image 
    src="/logo-taskflow.png" 
    alt="TaskFlow Logo"
    width={160} 
    height={50}  
    priority 
    style={{ width: 'auto', height: '42px', display: 'block' }}
  />
  <h2 className={styles["header-new__logo-text"]}>TaskFlow</h2>
</Link>

        <nav className={styles["header-new__nav"]}>
          <Link
            href="/"
            className={`${styles["header-new__nav-link"]} ${styles["header-new__nav-link--active"]}`}
          >
            Directory
          </Link>
          <a href="#" className={styles["header-new__nav-link"]}>
            Teams
          </a>
          <a href="#" className={styles["header-new__nav-link"]}>
            Projects
          </a>
          <a href="#" className={styles["header-new__nav-link"]}>
            Insights
          </a>
        </nav>
      </div>

      <div className={styles["header-new__right"]}>
        <div className={styles["header-new__search"]}>
          <span className={`material-symbols-outlined ${styles["header-new__search-icon"]}`}>
            search
          </span>
          <input
            className={styles["header-new__search-input"]}
            placeholder="Find a team member..."
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

        {usuario ? (
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ color: "#334155", fontSize: 14 }}>Hola, {usuario}</span>
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

        <img
          className={styles["header-new__avatar"]}
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuC1rTaRr9kGD3A_1xu71HkvhhqppJ0W3G3robgL9hDj7iCGqM3NU_5IFXSsVsQwUcDs_WdsoWWCkEiEu2CqE5RplLM4QeMAo234mhnfarwYyRVtXbAOXTkEBMshHBHCYXcsWj-yHtmhZFPnW4PdDx2a-Txr5_xrACQj33x8Ho__d53OddV0Tovu4sNV2NRU_XYwkhCaP1qdNTBg6mvktQ9KsaN-RrPpoWayuZD01MQVvZShuHbKm1GM59dFX7fZvahHpBp7Tt_U-X0"
          alt="Profile picture"
        />
      </div>
    </header>
  );
}
