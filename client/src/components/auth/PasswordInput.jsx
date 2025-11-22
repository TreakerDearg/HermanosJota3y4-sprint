import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function PasswordInput({ value, onChange, placeholder }) {
  const [show, setShow] = useState(false);

  return (
    <div className="password-container">
      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="auth-input"
      />
      <button
        type="button"
        className="password-toggle"
        onClick={() => setShow(!show)}
      >
        {show ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
}
