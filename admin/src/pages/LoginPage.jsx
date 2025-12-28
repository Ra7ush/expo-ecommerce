import React from "react";
import { SignIn } from "@clerk/clerk-react";
import { ShoppingBagIcon } from "lucide-react";

function LoginPage() {
  return (
    <div className="min-h-screen bg-base-100 flex flex-col md:flex-row">
      <div className="hidden md:flex md:w-1/2 bg-neutral p-12 flex-col justify-between text-neutral-content relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[120px] rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/20 blur-[120px] rounded-full -ml-32 -mb-32"></div>

        <div className="z-10 flex items-center gap-3">
          <div className="size-12 bg-primary rounded-2xl flex items-center justify-center">
            <ShoppingBagIcon className="size-7 text-primary-content" />
          </div>
          <span className="text-3xl font-black tracking-tighter">
            ANTIGRAVITY STORE
          </span>
        </div>

        <div className="z-10 space-y-6">
          <h1 className="text-6xl font-black leading-none uppercase tracking-tighter">
            Control your{" "}
            <span className="text-primary italic underline decoration-wavy decoration-2 underline-offset-8">
              Universe
            </span>
          </h1>
          <p className="text-xl opacity-70 max-w-sm leading-relaxed">
            The most advanced e-commerce dashboard for managing products,
            monitoring sales, and scaling your business limitlessly.
          </p>
        </div>

        <div className="z-10 flex gap-8">
          <div className="text-sm opacity-40 font-mono tracking-widest uppercase">
            Admin Panel v1.0
          </div>
          <div className="text-sm opacity-40 font-mono tracking-widest uppercase">
            Secure Encryption Enabled
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center p-8 bg-base-300/30">
        <div className="md:hidden flex items-center gap-3 mb-12">
          <div className="size-10 bg-primary rounded-xl flex items-center justify-center">
            <ShoppingBagIcon className="size-6 text-primary-content" />
          </div>
          <span className="text-2xl font-black tracking-tighter uppercase">
            Admin
          </span>
        </div>

        <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700">
          <SignIn
            appearance={{
              elements: {
                rootBox: "mx-auto",
                card: "bg-base-200 shadow-2xl border border-base-300 rounded-3xl",
                headerTitle: "text-2xl font-black tracking-tight",
                headerSubtitle: "text-base-content/60",
                socialButtonsBlockButton:
                  "btn btn-outline border-base-300 rounded-xl hover:bg-base-300",
                formButtonPrimary:
                  "btn btn-primary rounded-xl border-none font-bold uppercase tracking-wider",
                footerActionLink: "text-primary hover:underline",
                formFieldInput: "input input-bordered rounded-xl bg-base-100",
                formFieldLabel: "text-sm font-bold opacity-70 mb-1",
              },
            }}
          />
        </div>

        <div className="mt-12 text-center space-y-2">
          <p className="text-xs opacity-40 font-medium">
            Authorized Personnel Only
          </p>
          <div className="flex justify-center gap-4 text-[10px] uppercase font-bold tracking-widest opacity-20 hover:opacity-100 transition-opacity">
            <a href="#" className="hover:text-primary transition-colors">
              Privacy Policy
            </a>
            <span>•</span>
            <a href="#" className="hover:text-primary transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
