import { Outlet, Link } from "react-router-dom";
import { LogIn, ShoppingBag, Clock3, MapPin, Phone } from "lucide-react";
import AppLogo from "../common/AppLogo";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";

export default function PublicLayout() {
  const { count } = useCart();
  const { user, role, loading } = useAuth();

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

  const accountPath = !user
    ? "/login"
    : role === "customer"
      ? "/login"
      : role
        ? `/${role.replace("_", "-")}`
        : "/login";

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

            <Link
              className="btn-primary hidden sm:inline-flex"
              to={accountPath}
            >
              <LogIn size={18} />
              {user ? "Account" : "Login"}
            </Link>
          </div>
        </div>
      </header>

      <Outlet />

      <footer className="border-t bg-white">
        <div className="container-ui grid gap-5 py-7 md:grid-cols-2">
          <AppLogo />

          <p className="text-sm text-stone-600">
            <MapPin /> 12 Woodlands Square Tower 1, #06-64, Singapore 737715
            <Phone />
            <span>+65 62599810 , +65 63965563</span>
          </p>

          <p className="text-sm text-stone-600">
            {/* <div className="py-3 text-center text-xs text-stone-400"> */}©
            made with ❤️. All rights reserved by Lavya.
            {/* </div> */}
          </p>
        </div>
      </footer>
    </>
  );
}
