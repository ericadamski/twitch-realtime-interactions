import { useEffect } from "react";
import { useRouter } from "next/router";

export default function TwitchCallback() {
  const router = useRouter();
  const { code, state } = router.query;

  useEffect(() => {
    if (typeof window !== undefined && code != null) {
      const state = localStorage.getItem("__ts");

      console.log(state, state);

      if (state != state) {
        // you cannot auth.
        return;
      }

      fetch(`/api/auth/callback/twitch?code=${code}`).then((response) => {
        if (response.ok) {
          router.push("/");
        }
      });
    }
  }, [code, state]);

  return "Redirecting...";
}
