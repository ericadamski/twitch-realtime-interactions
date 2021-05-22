import { useEffect } from "react";
import { useRouter } from "next/router";

export default function TwitchCallback() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== undefined && router.query.code != null) {
      const state = localStorage.getItem("__ts");

      if (router.query.state != state) {
        // you cannot auth.
        return;
      }

      fetch(`/api/auth/callback/twitch?code=${router.query.code}`).then(
        (response) => {
          if (response.ok) {
            router.push("/");
          }
        }
      );
    }
  }, [router.query.code, router.query.state]);

  return "Redirecting...";
}
