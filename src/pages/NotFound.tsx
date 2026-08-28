import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";

export default function NotFoundPage() {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <div className="text-center">
        <h1 className="font-display mb-4 text-5xl font-bold text-primary">404</h1>
        <p className="mb-4 text-lg text-muted-foreground">Oops! Page not found</p>
        <Link to="/" className="text-sm text-primary underline underline-offset-4 hover:text-primary/80">
          Return to Home
        </Link>
      </div>
    </div>
  );
}
