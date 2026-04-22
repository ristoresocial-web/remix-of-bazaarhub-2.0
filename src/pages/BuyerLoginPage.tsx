import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import LoginForm from "@/components/auth/LoginForm";

const BuyerLoginPage: React.FC = () => {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-background px-4 py-10">
      <Helmet>
        <title>Log In · Bazaar Hub</title>
        <meta name="description" content="Log in to your Bazaar Hub account with email and password." />
      </Helmet>

      <div className="mx-auto w-full max-w-md rounded-card border border-border bg-card p-6 shadow-card">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-foreground">Welcome back</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Log in to track prices, save favourites, and more.
          </p>
        </div>

        <LoginForm />

        <p className="mt-6 text-center text-sm text-muted-foreground">
          New to Bazaar Hub?{" "}
          <Link to="/auth?mode=register" className="font-semibold text-primary hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default BuyerLoginPage;
