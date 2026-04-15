import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import BazaarLogo from "@/components/BazaarLogo";

const NotFound = () => (
  <div className="flex min-h-screen items-center justify-center bg-background">
    <Helmet>
      <title>Page Not Found — Bazaar Hub</title>
    </Helmet>
    <div className="text-center px-4">
      <BazaarLogo className="mx-auto mb-6 text-4xl" showTagline={false} />
      <h1 className="text-8xl font-bold text-primary mb-4">404</h1>
      <p className="text-xl font-semibold text-foreground mb-1">பக்கம் கிடைக்கவில்லை</p>
      <p className="text-lg text-muted-foreground mb-8">Page Not Found</p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button asChild size="lg">
          <Link to="/">Go to Homepage</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link to="/search"><Search className="h-4 w-4 mr-2" /> Search Products</Link>
        </Button>
      </div>
    </div>
  </div>
);

export default NotFound;
