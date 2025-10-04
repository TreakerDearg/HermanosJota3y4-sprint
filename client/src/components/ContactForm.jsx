import { useState } from "react";
import "../styles/components/ContactForm.css";

function ContactForm() {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    mensaje: "",
  });

  const [enviado, setEnviado] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validación básica adicional
    if (!formData.nombre || !formData.email || !formData.mensaje) {
      alert("Por favor completa todos los campos.");
      return;
    }

    // Simula envío
    console.log("Datos enviados:", formData);
    setEnviado(true);

    // Limpiar formulario
    setFormData({ nombre: "", email: "", mensaje: "" });

    // Ocultar mensaje después de 4 segundos
    setTimeout(() => setEnviado(false), 4000);
  };

  return (
    <section className="contact-form">
      <h2 className="form-title">
        <i className="fa-solid fa-envelope"></i> Contáctanos
      </h2>

      <form onSubmit={handleSubmit} className="form-content">
        <div className="input-group">
          <label htmlFor="nombre">
            <i className="fa-solid fa-user"></i> Nombre
          </label>
          <input
            id="nombre"
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Tu nombre completo"
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="email">
            <i className="fa-solid fa-envelope-open-text"></i> Email
          </label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="tucorreo@ejemplo.com"
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="mensaje">
            <i className="fa-solid fa-comment"></i> Mensaje
          </label>
          <textarea
            id="mensaje"
            name="mensaje"
            value={formData.mensaje}
            onChange={handleChange}
            placeholder="Escribe tu mensaje aquí..."
            required
          ></textarea>
        </div>

        <button type="submit" className="submit-btn">
          <i className="fa-solid fa-paper-plane"></i> Enviar
        </button>
      </form>

      {enviado && (
        <p className="mensaje-exito">
          <i className="fa-solid fa-circle-check"></i> ¡Tu mensaje fue enviado con éxito!
        </p>
      )}
    </section>
  );
}

export default ContactForm;
