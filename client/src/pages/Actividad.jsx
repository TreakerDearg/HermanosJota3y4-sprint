import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import "../styles/pages/Actividad.css";
import { FaShoppingCart } from "react-icons/fa";

export default function Actividad() {
  const { user } = useAuth();
  const [historial, setHistorial] = useState([]);

  // Simulación: cargar compras del usuario desde localStorage o API
  useEffect(() => {
    if (user) {
      const saved = localStorage.getItem(`historial_${user._id}`);
      setHistorial(saved ? JSON.parse(saved) : []);
    }
  }, [user]);

  return (
    <div className="actividad-page">
      <header className="actividad-header">
        <h1>📊 Actividad de {user?.nombre || "Usuario"}</h1>
        <p>Aquí puedes ver tus compras y actividad reciente.</p>
      </header>

      {historial.length === 0 ? (
        <p className="actividad-vacia">No hay actividad reciente.</p>
      ) : (
        <div className="historial-compras">
          {historial.map((compra, idx) => (
            <div className="compra-card" key={idx}>
              <div className="compra-header">
                <FaShoppingCart className="icono-compra" />
                <span>{new Date(compra.fecha).toLocaleString()}</span>
              </div>

              <ul className="productos-compra">
                {compra.productos.map((p, i) => (
                  <li key={i}>
                    {p.nombre} x{p.cantidad} -{" "}
                    {new Intl.NumberFormat("es-AR", {
                      style: "currency",
                      currency: "ARS",
                      minimumFractionDigits: 0,
                    }).format(p.precio * p.cantidad)}
                  </li>
                ))}
              </ul>

              <div className="total-compra">
                Total:{" "}
                {new Intl.NumberFormat("es-AR", {
                  style: "currency",
                  currency: "ARS",
                  minimumFractionDigits: 0,
                }).format(compra.total)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
