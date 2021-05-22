import { GetServerSideProps } from "next";
import React, { useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

import * as Twitch from "lib/twitch";

interface Props {
  twitchAuthUrl: string;
  state: string;
}

export default function Home(props: Props) {
  useEffect(() => {
    if (typeof window !== undefined) {
      localStorage.setItem("__ts", props.state);
    }
  }, [props.state]);

  return <a href={props.twitchAuthUrl}>login with twitch</a>;
}

export const getServerSideProps: GetServerSideProps<Props> =
  async function getServerSideProps() {
    const state = uuidv4();

    return {
      props: {
        twitchAuthUrl: Twitch.getOAuthUrl(state),
        state,
      },
    };
  };
