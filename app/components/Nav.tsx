import { Link } from "@remix-run/react";

export default function Nav({ user }: { user: { username: string } | null }) {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-xl font-bold">
          Expense Splitter
        </Link>
        <div>
          {user ? (
            <>
              <span className="text-white mr-4">Welcome, {user.username}!</span>
              <Link to="/optimizacion-divisas" className="text-white mr-4">
                Optimización de Divisas
              </Link>
              <Link to="/optimizacion-global" className="text-white mr-4">
                Optimización Global
              </Link>
            </>
          ) : (
            <>
              <Link to="/login" className="text-white mr-4">
                Login
              </Link>
              <Link to="/register" className="text-white">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}