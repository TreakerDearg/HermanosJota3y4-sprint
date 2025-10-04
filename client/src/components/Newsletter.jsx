import { useState } from "react";
import "../styles/components/Newsletter.css";

function Newsletter() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Email suscrito:", email);
    setEmail("");
    alert("¡Gracias por suscribirte!");
  };

  return (
    <section className="newsletter">
      <div className="newsletter-container">
        <h2 className="newsletter-title">Suscríbete a nuestras novedades</h2>
        <p className="newsletter-subtitle">
          Recibe ofertas exclusivas y novedades directamente en tu correo
        </p>

        <form className="newsletter-form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Ingresa tu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">Suscribirse</button>
        </form>
      </div>
    </section>
  );
}

export default Newsletter;
