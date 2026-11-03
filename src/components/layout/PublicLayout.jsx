import { Outlet, Link, useNavigate } from "react-router-dom";
import { LogIn, ShoppingBag, Clock3, MapPin, Phone } from "lucide-react";
import AppLogo from "../common/AppLogo";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

export default function PublicLayout() {
  const { count } = useCart();
  const { user, role, loading, signOut } = useAuth();
  const navigate = useNavigate();

  console.log("user", user);
  console.log("role", role);
  console.log("loading", loading);

  // Prevent rendering while authentication is loading
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-rose-200 border-t-rose-700"></div>
          <p className="mt-4 text-sm font-medium text-stone-600">
            Loading Food Items...
          </p>
        </div>
      </div>
    );
  }

  async function handleLogout() {
    try {
      await signOut();

      toast.success("Logged out successfully");

      navigate("/login", {
        replace: true,
      });
    } catch (error) {
      console.error("Logout failed:", error);

      toast.error("Unable to logout. Please try again.");
    }
  }

  return (
    <>
      <header className="sticky top-0 z-40 border-b bg-cream/95 backdrop-blur">
        <div className="container-ui flex h-16 items-center justify-between">
          <AppLogo compact />

          <nav className="hidden gap-2 md:flex">
            <Link className="nav-link" to="/">
              Home
            </Link>

            <Link className="nav-link" to="/menu">
              Menu
            </Link>

            <Link className="nav-link" to="/delivery">
              Delivery
            </Link>
          </nav>

          <div className="flex gap-2">
            <Link className="btn-secondary" to="/cart">
              <ShoppingBag size={18} />
              Basket {count ? `(${count})` : ""}
            </Link>

            {user ? (
              <>
                <Link
                  className="btn-primary hidden sm:inline-flex"
                  to="/profile"
                >
                  Account
                </Link>

                <button
                  type="button"
                  className="btn-secondary hidden sm:inline-flex"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            ) : (
              <Link className="btn-primary hidden sm:inline-flex" to="/login">
                <LogIn size={18} />
                Login
              </Link>
            )}
          </div>
        </div>
      </header>
      <Outlet />

      <footer className="border-t border-stone-200 bg-white">
        <div className="container-ui py-6">
          <div className="grid gap-6 md:grid-cols-2 md:items-start">
            {/* Logo */}
            <div>
              <AppLogo />

              <p className="mt-4 text-xs text-stone-400">
                © {new Date().getFullYear()} RKJ THONDAMANS FOOD PTE LTD. All
                rights reserved. Made with ❤️ by Lavya
              </p>
            </div>

            {/* Contact Information */}
            <div className="space-y-3 md:justify-self-end">
              {/* Address */}
              <div className="flex items-start gap-3 text-sm text-stone-600">
                <MapPin size={18} className="mt-0.5 shrink-0 text-rose-700" />

                <span className="leading-6">
                  12 Woodlands Square Tower 1,
                  <br />
                  #06-64, Singapore 737715
                </span>
              </div>

              {/* Phone Numbers */}
              <div className="flex items-center gap-3 text-sm text-stone-600">
                <Phone size={18} className="shrink-0 text-rose-700" />

                <div className="flex flex-wrap items-center gap-2">
                  <a
                    href="tel:+6562599810"
                    className="transition hover:text-rose-700"
                  >
                    +65 6259 9810
                  </a>

                  <span className="text-stone-300">|</span>

                  <a
                    href="tel:+6563965563"
                    className="transition hover:text-rose-700"
                  >
                    +65 6396 5563
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
