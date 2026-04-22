import React from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, Store, ArrowRight } from "lucide-react";
import { Helmet } from "react-helmet-async";

const LoginChooserPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Log In | BazaarHub</title>
        <meta name="description" content="Choose how you'd like to log in to BazaarHub — as a buyer or as a seller." />
      </Helmet>
      <div className="min-h-[calc(100vh-3.5rem)] bg-gradient-to-br from-accent/40 via-background to-accent/20 px-4 py-10 sm:py-16">
        <div className="mx-auto w-full max-w-2xl">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
              How would you like to log in?
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Choose your account type to continue
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Link
              to="/buyer/login"
              className="group relative flex flex-col items-center gap-3 rounded-card border-2 border-border bg-card p-6 text-center shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-primary hover:shadow-lg"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors duration-200 group-hover:bg-primary group-hover:text-primary-foreground">
                <ShoppingBag className="h-8 w-8" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground">I'm a Buyer</h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  Compare prices, find deals, save favorites
                </p>
              </div>
              <span className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                Continue <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </span>
            </Link>

            <Link
              to="/seller/login"
              className="group relative flex flex-col items-center gap-3 rounded-card border-2 border-border bg-card p-6 text-center shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-primary hover:shadow-lg"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors duration-200 group-hover:bg-primary group-hover:text-primary-foreground">
                <Store className="h-8 w-8" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground">I'm a Seller</h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  Manage products, reach more buyers, grow sales
                </p>
              </div>
              <span className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                Continue <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </span>
            </Link>
          </div>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            New here?{" "}
            <Link to="/auth?tab=register" className="font-semibold text-primary hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default LoginChooserPage;
