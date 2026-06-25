"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./FooterNew.module.css";

export default function FooterNew() {
  const [estaLogueado, setEstaLogueado] = useState(false);

  useEffect(() => {
    function revisarAuth() {
      const token = localStorage.getItem("token");
      setEstaLogueado(!!token); 
    }

    
    revisarAuth();

    
    window.addEventListener("cambioAuth", revisarAuth);

    return () => {
      window.removeEventListener("cambioAuth", revisarAuth);
    };
  }, []);

  return (
    <footer className={styles["footer-new"]}>
      <div className={styles["footer-new__inner"]}>
        <div className={styles["footer-new__brand"]}>
          <span className={`material-symbols-outlined ${styles["footer-new__brand-icon"]}`}>
           
          </span>
          <span>&copy; 2026 TaskFlow. Todos los derechos reservados.</span>
        </div>

        <div className={styles["footer-new__links"]}>
          {estaLogueado ? (
            <>
              
              <a 
                href="https://checklist-fwabdbgzf3cvf2br.brazilsouth-01.azurewebsites.net" 
                target="_blank" 
                rel="noopener noreferrer" 
                className={styles["footer-new__link"]}
              >
                Servidor Azure (API)
              </a>
              <Link href="/user" className={styles["footer-new__link"]}>
                Soporte de Usuarios
              </Link>
              <a href="#" className={styles["footer-new__link"]}>
                Centro de Ayuda
              </a>
            </>
          ) : (
            <>
              
              <a href="#" className={styles["footer-new__link"]}>
                Política de Privacidad
              </a>
              <a href="#" className={styles["footer-new__link"]}>
                Términos del Servicio
              </a>
            </>
          )}
        </div>
      </div>
    </footer>
  );
}