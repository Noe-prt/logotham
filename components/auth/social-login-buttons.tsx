"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";

const TwitterIcon = (props: React.SVGAttributes<SVGSVGElement>) => (
  <svg fill="none" viewBox="0 0 1200 1227" {...props}>
    <path
      fill="currentColor"
      d="M714.163 519.284 1160.89 0h-105.86L667.137 450.887 357.328 0H0l468.492 681.821L0 1226.37h105.866l409.625-476.152 327.181 476.152H1200L714.137 519.284h.026ZM569.165 687.828l-47.468-67.894-377.686-540.24h162.604l304.797 435.991 47.468 67.894 396.2 566.721H892.476L569.165 687.854v-.026Z"
    />
  </svg>
);

const providers = [
  {
    provider: "google" as const,
    label: "Continue with Google",
    Icon: GoogleIcon,
  },
  {
    provider: "twitter" as const,
    label: "Continue with X (Twitter)",
    Icon: TwitterIcon,
  },
  {
    provider: "github" as const,
    label: "Continue with GitHub",
    Icon: GithubIcon,
  },
];

export function SocialLoginButtons() {
  const router = useRouter();
  const [currentProvider, setCurrentProvider] = React.useState<string | null>(
    null,
  );

  const handleSignIn = async (
    provider: (typeof providers)[number]["provider"],
  ) => {
    try {
      setCurrentProvider(provider);
      const { data, error } = await authClient.signIn.social({
        provider,
        callbackURL: "/",
      });

      if (error) {
        console.error(error);
        toast.error(error.message ?? "Unable to sign in right now.");
        setCurrentProvider(null);
        return;
      }

      if (data?.url) {
        router.push(data.url);
        return;
      }

      router.refresh();
      toast.success("Signed in successfully.");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
      setCurrentProvider(null);
    }
  };

  return (
    <div className="flex w-full flex-col gap-3">
      {providers.map(({ provider, label, Icon }) => (
        <Button
          key={provider}
          variant="outline"
          className="w-full justify-start gap-3"
          onClick={() => {
            handleSignIn(provider);
          }}
        >
          {currentProvider === provider ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Redirecting…
            </>
          ) : (
            <>
              <Icon className="h-5 w-5" aria-hidden="true" />
              <span>{label}</span>
            </>
          )}
        </Button>
      ))}
    </div>
  );
}

function GoogleIcon(props: React.SVGAttributes<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M22 12.2278C22 11.507 21.9341 10.8108 21.8125 10.1392H12.2428V14.0965H17.7349C17.498 15.4356 16.7523 16.5669 15.6129 17.321L18.8338 19.8087C20.7812 18.0161 22 15.3788 22 12.2278Z"
        fill="#4285F4"
      />
      <path
        d="M12.2429 22.0002C15.1191 22.0002 17.5369 21.0529 18.8338 19.8086L15.6129 17.3209C14.9167 17.7887 14.0031 18.0763 12.2429 18.0763C9.46331 18.0763 7.10909 16.2658 6.26715 13.7437L2.94641 16.3135C4.66649 19.7808 8.16199 22.0002 12.2429 22.0002Z"
        fill="#34A853"
      />
      <path
        d="M6.26715 13.7436C6.05047 13.0756 5.92485 12.3601 5.92485 11.6247C5.92485 10.8892 6.05047 10.1738 6.25516 9.50586L2.92274 6.90039C2.2047 8.36128 1.79712 9.94402 1.79712 11.6247C1.79712 13.3053 2.2047 14.888 2.92274 16.349L6.26715 13.7436Z"
        fill="#FBBC05"
      />
      <path
        d="M12.2429 5.17392C14.221 5.17392 15.6411 6.02657 16.4258 6.74199L18.8978 4.3159C17.5244 2.80861 15.1191 1.25 12.2429 1.25C8.16199 1.25 4.66649 3.46938 2.92274 6.93673L6.25516 9.50583C7.10909 6.98376 9.46331 5.17392 12.2429 5.17392Z"
        fill="#EA4335"
      />
    </svg>
  );
}

function GithubIcon(props: React.SVGAttributes<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 1.5c-5.387 0-9.75 4.447-9.75 9.94 0 4.39 2.865 8.112 6.84 9.433.5.097.683-.22.683-.486 0-.24-.01-1.04-.014-1.89-2.782.617-3.37-1.207-3.37-1.207-.454-1.176-1.11-1.49-1.11-1.49-.908-.63.07-.617.07-.617 1.004.072 1.533 1.054 1.533 1.054.893 1.566 2.343 1.115 2.913.854.09-.662.35-1.115.636-1.372-2.222-.26-4.556-1.138-4.556-5.065 0-1.118.39-2.032 1.03-2.748-.103-.26-.447-1.31.098-2.732 0 0 .84-.27 2.75 1.05a9.356 9.356 0 0 1 2.5-.343 9.33 9.33 0 0 1 2.5.343c1.91-1.32 2.748-1.05 2.748-1.05.547 1.422.203 2.472.1 2.732.64.716 1.028 1.63 1.028 2.748 0 3.94-2.338 4.8-4.566 5.057.36.315.68.93.68 1.876 0 1.356-.012 2.45-.012 2.78 0 .27.18.59.688.488 3.972-1.323 6.836-5.044 6.836-9.43C21.75 5.947 17.387 1.5 12 1.5z" />
    </svg>
  );
}
