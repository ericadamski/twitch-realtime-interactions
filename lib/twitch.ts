const TWITCH_AUTH_URL = "https://id.twitch.tv/oauth2";
const TWITCH_API_URL = "https://api.twitch.tv/helix";

const REDIRECT_URI = encodeURIComponent(
  process.env.NODE_ENV === "production"
    ? ""
    : "http://localhost:3000/auth/callback/twitch"
);

export function getOAuthUrl(state?: string) {
  const scopes = ["user:read:email"];

  return `${TWITCH_AUTH_URL}/authorize?client_id=${
    process.env.TWITCH_CLIENT_ID
  }&redirect_uri=${REDIRECT_URI}&response_type=code&scope=${scopes.join(" ")}${
    state ? `&state=${state}` : ""
  }`;
}

export function getOAuthToken(code: string) {
  return fetch(
    `${TWITCH_AUTH_URL}/token?client_id=${process.env.TWITCH_CLIENT_ID}&client_secret=${process.env.TWITCH_CLIENT_SECRET}&code=${code}&grant_type=authorization_code&redirect_uri=${REDIRECT_URI}`,
    {
      method: "POST",
    }
  );
}

export function getUser(token: string) {
  return fetch(`${TWITCH_API_URL}/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Client-Id": process.env.TWITCH_CLIENT_ID,
    },
  }).then(async (response) => {
    if (response.ok) {
      const { data } = await response.json();
      const [{ displayName, offline_image_url, profile_image_url, id, login }] =
        data;

      return {
        displayName,
        imageUrl:
          profile_image_url.length > 0 ? profile_image_url : offline_image_url,
        id,
        login,
      };
    }
  });
}
