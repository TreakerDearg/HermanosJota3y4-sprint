import ContactForm from "../components/ContactForm";

const Contacto = () => {
  if (!ContactForm) return <p style={{ textAlign: "center" }}>Formulario de contacto no disponible.</p>;

  return <ContactForm />;
};

export default Contacto;
