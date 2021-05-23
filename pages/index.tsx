import { GetServerSideProps } from "next";
import dynamic from "next/dynamic";
import React, { useEffect, ComponentProps } from "react";
import { v4 as uuidv4 } from "uuid";
import * as Cookie from "cookie";

import { Twitch as TwitchPlayerForType } from "components/Twitch";

const TwitchPlayer = dynamic<ComponentProps<typeof TwitchPlayerForType>>(() =>
  import("components/Twitch").then(({ Twitch }) => Twitch)
);
import * as Twitch from "lib/twitch";
import { User } from "types/user";

interface Props {
  twitchAuthUrl: string;
  state: string;
  user: User | null;
}

export default function Home(props: Props) {
  useEffect(() => {
    if (typeof window !== undefined && props.user == null) {
      localStorage.setItem("__ts", props.state);
    }
  }, [props.state, props.user]);

  return (
    <>
      {props.user ? (
        <TwitchPlayer user={props.user} />
      ) : (
        <a href={props.twitchAuthUrl}>login with twitch</a>
      )}
      <style global jsx>{`
        html,
        body,
        *,
        * > * {
          padding: 0;
          margin: 0;
          box-sizing: border-box;
        }
      `}</style>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<Props> =
  async function getServerSideProps(context) {
    const {
      headers: { cookie },
    } = context.req;
    const { __trtiu: userString } = Cookie.parse(cookie);
    const state = uuidv4();

    let user: User | null = null;

    try {
      user = JSON.parse(userString);
    } catch {}

    return {
      props: {
        twitchAuthUrl: Twitch.getOAuthUrl(state),
        state,
        user,
      },
    };
  };
