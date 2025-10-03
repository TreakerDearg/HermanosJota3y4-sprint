import React, { useState } from "react";
import "../styles/components/ContactForm.css";

function ContactForm() {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    mensaje: "",
  });

  const [enviado, setEnviado] = useState(false);

  // Actualiza el estado cuando el usuario escribe
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Maneja el submit
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Datos del formulario:", formData);
    setEnviado(true);
    // Limpiar formulario si quieres
    setFormData({ nombre: "", email: "", mensaje: "" });
    // El mensaje de éxito se puede ocultar después de unos segundos
    setTimeout(() => setEnviado(false), 5000);
  };

  return (
    <div className="contact-form">
      <h2>Contacto</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Nombre:
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Mensaje:
          <textarea
            name="mensaje"
            value={formData.mensaje}
            onChange={handleChange}
            required
          />
        </label>

        <button type="submit">Enviar</button>
      </form>

      {enviado && <p className="exito">¡Formulario enviado con éxito!</p>}
    </div>
  );
}

export default ContactForm;
