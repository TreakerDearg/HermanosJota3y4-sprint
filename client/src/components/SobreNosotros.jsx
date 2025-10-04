import "../styles/components/SobreNosotros.css";
import calidadImg from "../assets/Mesa de Noche Aconcagua.png"; // Ejemplo de imagen
import confortImg from "../assets/Escritorio Costa.png";
import diseñoImg from "../assets/Sillas Cordoba.png";

function SobreNosotros() {
  const valores = [
    { icon: calidadImg, title: "Calidad", desc: "Materiales duraderos y acabados impecables." },
    { icon: confortImg, title: "Confort", desc: "Diseños ergonómicos pensados para tu comodidad." },
    { icon: diseñoImg, title: "Diseño", desc: "Estilo moderno que se adapta a tu hogar." },
  ];

  return (
    <section className="sobre-nosotros">
      <div className="container">
        <div className="texto">
          <h2 className="titulo">Sobre Nosotros</h2>
          <p>
            En Hermanos Jota fabricamos muebles de calidad con pasión por el diseño y la comodidad.
            Cada pieza refleja nuestra dedicación y amor por el detalle.
          </p>
          <button className="btn-sobre" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            Ver Catálogo
          </button>
        </div>

        <div className="valores">
          {valores.map((v, i) => (
            <div key={i} className="valor-card">
              <img src={v.icon} alt={v.title} className="valor-icon" />
              <h3>{v.title}</h3>
              <p>{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SobreNosotros;
