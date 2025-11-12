import { useState, useRef } from "react";

export default function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const formRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMsg("Procesando...");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:4000"}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setMsg("¡Has iniciado sesión correctamente!");
        if (formRef.current) {
          formRef.current.classList.add("success");
          setTimeout(() => formRef.current.classList.remove("success"), 2000);
        }
      } else {
        setMsg(data.message || "Error al iniciar sesión");
        if (formRef.current) {
          formRef.current.classList.add("error");
          setTimeout(() => formRef.current.classList.remove("error"), 2000);
        }
      }
    } catch (err) {
      setMsg("No se pudo conectar con el servidor");
      if (formRef.current) {
        formRef.current.classList.add("error");
        setTimeout(() => formRef.current.classList.remove("error"), 2000);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Formulario */}
      <form 
        ref={formRef}
        onSubmit={handleSubmit} 
        style={styles.loginForm}
      >
        <div style={styles.formHeader}>
          <div style={styles.logo}>
            <div style={styles.logoIcon}>⚡</div>
          </div>
          <h1 style={styles.title}>Bienvenido de nuevo</h1>
          <p style={styles.subtitle}>Ingresa tus credenciales para continuar</p>
        </div>

        <div style={styles.inputGroup}>
          <div 
            style={{
              ...styles.inputContainer,
              ...(focusedField === 'email' && styles.inputFocused),
              ...(email && styles.inputHasValue)
            }}
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField(null)}
              style={styles.input}
              required
            />
            <label style={styles.inputLabel}>Email</label>
            <div style={{
              ...styles.inputUnderline,
              width: focusedField === 'email' ? '100%' : '0%'
            }}></div>
          </div>

          <div 
            style={{
              ...styles.inputContainer,
              ...(focusedField === 'password' && styles.inputFocused),
              ...(password && styles.inputHasValue)
            }}
          >
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setFocusedField('password')}
              onBlur={() => setFocusedField(null)}
              style={styles.input}
              required
            />
            <label style={styles.inputLabel}>Contraseña</label>
            <div style={{
              ...styles.inputUnderline,
              width: focusedField === 'password' ? '100%' : '0%'
            }}></div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          style={{
            ...styles.loginButton,
            ...(isLoading && styles.buttonLoading)
          }}
          onMouseOver={(e) => {
            if (!isLoading) {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 10px 25px -5px rgba(59, 130, 246, 0.4)';
            }
          }}
          onMouseOut={(e) => {
            if (!isLoading) {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }
          }}
        >
          <span style={{
            ...styles.buttonText,
            opacity: isLoading ? 0 : 1
          }}>
            {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </span>
          {isLoading && (
            <div style={styles.buttonLoader}>
              <div style={styles.spinner}></div>
            </div>
          )}
        </button>

        <div style={styles.formFooter}>
          <a href="#" style={styles.forgotPassword}>¿Olvidaste tu contraseña?</a>
        </div>

        {msg && (
          <div style={{
            ...styles.message,
            ...(msg.includes('correctamente') ? styles.messageSuccess : styles.messageError)
          }}>
            <div style={styles.messageIcon}>
              {msg.includes('correctamente') ? '✓' : '⚠'}
            </div>
            {msg}
          </div>
        )}
      </form>

      <style>{`
        @keyframes float {
          0%, 100% { 
            transform: translate(0, 0) rotate(0deg); 
          }
          33% { 
            transform: translate(30px, 50px) rotate(120deg); 
          }
          66% { 
            transform: translate(-20px, 80px) rotate(240deg); 
          }
        }

        @keyframes logoGlow {
          from { 
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.5); 
          }
          to { 
            box-shadow: 0 0 30px rgba(139, 92, 246, 0.7); 
          }
        }

        @keyframes successPulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.02); }
          100% { transform: scale(1); }
        }

        @keyframes errorShake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          75% { transform: translateX(8px); }
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .success {
          animation: successPulse 0.6s ease !important;
        }

        .error {
          animation: errorShake 0.5s ease !important;
        }

        /* Efectos para inputs con valor */
        .input-container-has-value .input-label {
          top: 0px !important;
          font-size: 0.8rem !important;
          color: #3b82f6 !important;
        }

        .input-container-focused .input-label {
          top: 0px !important;
          font-size: 0.8rem !important;
          color: #3b82f6 !important;
        }

        .input-container-focused input {
          border-bottom-color: transparent !important;
        }
      `}</style>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    width: "100vw",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)",
    color: "#fff",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    position: "fixed",
    top: 0,
    left: 0,
    overflow: "hidden",
    padding: "20px"
  },

  loginForm: {
    width: "100%",
    maxWidth: "400px",
    padding: "2.5rem",
    background: "rgba(17, 24, 39, 0.9)",
    backdropFilter: "blur(20px)",
    borderRadius: "20px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)",
    position: "relative",
    zIndex: 10,
    transition: "all 0.3s ease"
  },

  formHeader: {
    textAlign: "center",
    marginBottom: "2rem"
  },

  logo: {
    width: "60px",
    height: "60px",
    margin: "0 auto 1rem",
    background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
    borderRadius: "15px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.5rem",
    animation: "logoGlow 2s ease-in-out infinite alternate"
  },

  logoIcon: {
    // Estilo para el icono del logo
  },

  title: {
    fontSize: "1.75rem",
    fontWeight: "700",
    marginBottom: "0.5rem",
    background: "linear-gradient(135deg, #fff, #94a3b8)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text"
  },

  subtitle: {
    color: "#94a3b8",
    fontSize: "0.9rem"
  },

  inputGroup: {
    marginBottom: "1.5rem"
  },

  inputContainer: {
    position: "relative",
    marginBottom: "1.5rem"
  },

  inputFocused: {
    // Los estilos se manejan via CSS
  },

  inputHasValue: {
    // Los estilos se manejan via CSS
  },

  input: {
    width: "100%",
    padding: "1rem 0 0.5rem",
    background: "transparent",
    border: "none",
    borderBottom: "2px solid #374151",
    color: "#fff",
    fontSize: "1rem",
    outline: "none",
    transition: "all 0.3s ease"
  },

  inputLabel: {
    position: "absolute",
    top: "1rem",
    left: 0,
    color: "#94a3b8",
    fontSize: "1rem",
    pointerEvents: "none",
    transition: "all 0.3s ease",
    transformOrigin: "left"
  },

  inputUnderline: {
    position: "absolute",
    bottom: 0,
    left: 0,
    height: "2px",
    background: "linear-gradient(90deg, #3b82f6, #8b5cf6)",
    transition: "width 0.3s ease"
  },

  loginButton: {
    width: "100%",
    padding: "1rem",
    background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    position: "relative",
    overflow: "hidden",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },

  buttonLoading: {
    opacity: 0.8,
    cursor: "not-allowed"
  },

  buttonText: {
    transition: "opacity 0.3s ease"
  },

  buttonLoader: {
    position: "absolute",
    opacity: 1
  },

  spinner: {
    width: "20px",
    height: "20px",
    border: "2px solid transparent",
    borderTop: "2px solid #fff",
    borderRadius: "50%",
    animation: "spin 1s linear infinite"
  },

  formFooter: {
    textAlign: "center",
    marginTop: "1.5rem"
  },

  forgotPassword: {
    color: "#94a3b8",
    textDecoration: "none",
    fontSize: "0.9rem",
    transition: "color 0.3s ease"
  },

  message: {
    marginTop: "1rem",
    padding: "1rem",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    animation: "slideIn 0.3s ease"
  },

  messageSuccess: {
    background: "rgba(16, 185, 129, 0.1)",
    border: "1px solid rgba(16, 185, 129, 0.3)",
    color: "#10b981"
  },

  messageError: {
    background: "rgba(239, 68, 68, 0.1)",
    border: "1px solid rgba(239, 68, 68, 0.3)",
    color: "#ef4444"
  },

  messageIcon: {
    fontWeight: "bold"
  }
};