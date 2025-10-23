import "../styles/components/SobreNosotros.css";
import calidadImg from "../assets/Mesa de Noche Aconcagua.png";
import confortImg from "../assets/Escritorio Costa.png";
import diseñoImg from "../assets/Sillas Cordoba.png";

function SobreNosotros() {
  const valores = [
    { icon: calidadImg, title: "Calidad", desc: "Materiales duraderos y acabados impecables." },
    { icon: confortImg, title: "Confort", desc: "Diseños ergonómicos pensados para tu comodidad." },
    { icon: diseñoImg, title: "Diseño", desc: "Estilo moderno que se adapta a tu hogar." },
  ];

  const handleVerCatalogo = () => {
    const catalogo = document.getElementById("catalogo");
    if (catalogo) {
      catalogo.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <section className="sobre-nosotros" aria-labelledby="sobre-nosotros-titulo">
      <div className="container">
        <div className="texto">
          <h2 id="sobre-nosotros-titulo" className="titulo">Sobre Nosotros</h2>
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

        <ul className="valores" role="list">
          {valores.map((v, i) => (
            <li key={i} className="valor-card">
              <img src={v.icon} alt={v.title} className="valor-icon" />
              <h3>{v.title}</h3>
              <p>{v.desc}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default SobreNosotros;
