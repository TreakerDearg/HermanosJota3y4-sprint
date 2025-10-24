import "../styles/components/SobreNosotros.css";
import { useRef, useCallback } from "react";
import calidadImg from "../assets/Mesa de Noche Aconcagua.png";
import confortImg from "../assets/Escritorio Costa.png";
import diseñoImg from "../assets/Sillas Cordoba.png";

function SobreNosotros() {
  const catalogoRef = useRef(document.getElementById("catalogo"));

  const handleVerCatalogo = useCallback(() => {
    if (catalogoRef.current) {
      catalogoRef.current.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []);

  const valores = [
    { icon: calidadImg, title: "Calidad", desc: "Materiales duraderos y acabados impecables." },
    { icon: confortImg, title: "Confort", desc: "Diseños ergonómicos pensados para tu comodidad." },
    { icon: diseñoImg, title: "Diseño", desc: "Estilo moderno que se adapta a tu hogar." },
  ];

  return (
    <section className="sobre-nosotros" aria-labelledby="sobre-nosotros-titulo">
      <div className="container">
        <div className="texto">
          <h2 id="sobre-nosotros-titulo" className="titulo">
            Sobre Nosotros
          </h2>
          <p>
            En Hermanos Jota fabricamos muebles de calidad con pasión por el diseño y la comodidad.
            Cada pieza refleja nuestra dedicación y amor por el detalle.
          </p>
          <button
            className="btn-sobre"
            onClick={handleVerCatalogo}
            aria-label="Ver el catálogo de productos"
          >
            Ver Catálogo
          </button>
        </div>

        <ul className="valores">
          {valores.map((v, i) => (
            <li key={i} className="valor-card" role="article" aria-labelledby={`valor-title-${i}`} aria-describedby={`valor-desc-${i}`}>
              <img
                src={v.icon}
                alt={v.title}
                className="valor-icon"
                loading="lazy"
                width={100}
                height={100}
              />
              <h3 id={`valor-title-${i}`}>{v.title}</h3>
              <p id={`valor-desc-${i}`}>{v.desc}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default SobreNosotros;
