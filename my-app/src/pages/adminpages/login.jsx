import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Moon,
  Sun,
} from "lucide-react";
import BrandLogo from "../../components/brandlogo";
import { paintings } from "../../data/paintings";
import { useShop } from "../../context/shop";

export default function AdminLogin() {
  const { isAdmin, loginAdmin, theme, toggleTheme } = useShop();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const destination =
    location.state?.from?.startsWith("/admin/") &&
    location.state.from !== "/admin/login"
      ? location.state.from
      : "/admin";
  if (isAdmin) return <Navigate to={destination} replace />;
  function submit(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (
      !loginAdmin(String(data.get("username")), String(data.get("password")))
    ) {
      setError("Incorrect username or password. Please try again.");
      return;
    }
    navigate(destination, { replace: true });
  }
  return (
    <div className="login-shell">
      <header className="login-header">
        <Link to="/" aria-label="art-ana home">
          <BrandLogo />
        </Link>
        <button
          className="icon-button"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
        </button>
      </header>
      <main className="login-panel">
        <section
          className="login-art"
          style={{ "--painting-image": `url("${paintings[0].image}")` }}
          aria-label="Muscle Lisa artwork"
        >
          <div className="login-art-heading">
            <span className="login-art-chip">
              THE OTHER SIDE OF THE GALLERY
            </span>
            <h2>
              A little art.
              <br />A lot of character.
            </h2>
          </div>
          <img src={paintings[0].image} alt="Muscle Lisa" />
          <div className="login-art-caption">
            <strong>Muscle Lisa</strong>
            <span>Adaptation of Leonardo da Vinci</span>
          </div>
        </section>
        <section className="login-form-panel">
          <div className="login-form-content">
            <span className="login-lock">
              <LockKeyhole size={23} aria-hidden="true" />
            </span>
            <p className="section-eyebrow">ADMIN STUDIO</p>
            <h1>Welcome back.</h1>
            <p className="admin-muted">Your collection, behind the scenes.</p>
            <form onSubmit={submit} className="login-form">
              <label className="field">
                <span>Username</span>
                <input
                  name="username"
                  autoComplete="username"
                  required
                  maxLength={50}
                  placeholder="Enter your username"
                />
              </label>
              <label className="field">
                <span>Password</span>
                <span className="password-field">
                  <input
                    name="password"
                    aria-label="Password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    maxLength={100}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </span>
              </label>
              {error && (
                <p className="form-error" role="alert">
                  {error}
                </p>
              )}
              <button className="gallery-button full-width" type="submit">
                Sign in <ArrowRight size={17} aria-hidden="true" />
              </button>
            </form>
            <Link className="inline-link login-back" to="/">
              <ArrowLeft size={15} />
              Back to gallery
            </Link>
          </div>
        </section>
      </main>
      <footer className="login-footer">
        A space for art. A studio for you.
      </footer>
    </div>
  );
}
