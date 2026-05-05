import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Notfound = () => {
  const navigate = useNavigate();
  return (
    <div className="flex gap-6 flex-col min-h-[calc(100vh-48px)] items-center justify-center bg-bg-base text-text-primary">
      <div className="text-center space-y-2">
        <p className="text-8xl font-mono font-bold text-accent">404</p>
        <h1 className="text-2xl font-medium">Oops! Page not found</h1>
        <p className="text-text-secondary">The page you are looking for doesn't exist or has been moved.</p>
      </div>
      <Button onClick={() => navigate("/")} className="bg-accent hover:bg-accent/90">
        Return Home
      </Button>
    </div>
  )
}

export default Notfound