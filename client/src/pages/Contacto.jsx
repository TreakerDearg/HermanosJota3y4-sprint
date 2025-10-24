// src/pages/Contacto.jsx
import ContactForm from "../components/ContactForm";
import "../styles/pages/ContactoPage.css";

const Contacto = () => {
  return (
    <section className="contacto-page">
      <div className="contacto-container">
        <header className="contacto-header">
          <h1>Contáctanos</h1>
          <p>¿Tienes dudas o sugerencias? Completa el formulario y nos pondremos en contacto contigo.</p>
        </header>

        {ContactForm ? (
          <div className="contacto-form-wrapper">
            <ContactForm />
          </div>
        ) : (
          <p className="contacto-no-form" role="alert">
            Formulario de contacto no disponible.
          </p>
        )}
      </div>
    </section>
  );
};

export default Contacto;
