import { useEffect, useRef, useState, useMemo } from "react";
import TwitchEmbedVideo from "react-twitch-embed-video";
import { fromEvent } from "rxjs";
import { tap, switchMap, takeUntil, delay } from "rxjs/operators";

import { useWindowSize } from "hooks/useWindowSize";
import { User } from "types/user";
import UserHover from "./UserHover";
import { useReplicache } from "hooks/useReplicache";

interface Props {
  user: User;
}

export function Twitch(props: Props) {
  const rep = useReplicache();
  const ratioConstrainedContainer = useRef<HTMLDivElement>();
  const { width = 0, height = 0 } = useWindowSize();
  const [hideMouse, setHideMouse] = useState<boolean>(true);
  const [mousePosition, setMousePosition] = useState<{
    left?: number;
    top?: number;
  }>({});
  const constrainedDimensions = useMemo(() => {
    const aspectRatio = 1080 / 1920;
    const aspectRatioHeight = Math.min(aspectRatio * width, height - 64);
    const isCapped = aspectRatioHeight === height - 64;

    return {
      width: isCapped ? (height - 64) / aspectRatio : width,
      height: Math.min(aspectRatio * width, height - 64),
    };
  }, [width, height]);
  const ratioConstrainerContainerBoundingBox = useMemo(() => {
    if (
      ratioConstrainedContainer.current != null &&
      constrainedDimensions != null
    ) {
      return ratioConstrainedContainer.current.getBoundingClientRect();
    }
  }, [constrainedDimensions]);

  useEffect(() => {
    if (ratioConstrainedContainer.current != null) {
      const mouseEnter$ = fromEvent(
        ratioConstrainedContainer.current,
        "mouseenter"
      );

      const mouseLeave$ = fromEvent(
        ratioConstrainedContainer.current,
        "mouseleave"
      ).pipe(
        delay(200),
        takeUntil(mouseEnter$),
        tap(() => setHideMouse(true))
      );

      const mouseMove$ = fromEvent(
        ratioConstrainedContainer.current,
        "mousemove"
      ).pipe(takeUntil(mouseLeave$));

      const mouse$ = mouseEnter$.pipe(
        tap(() => setHideMouse(false)),
        switchMap(() => mouseMove$)
      );

      const sub = mouse$.subscribe((event: MouseEvent) => {
        const { top, left } =
          ratioConstrainerContainerBoundingBox ??
          ratioConstrainedContainer.current.getBoundingClientRect();

        setMousePosition({
          left: event.clientX - left + 16,
          top: event.clientY - top + 16,
        });
      });

      return () => sub.unsubscribe();
    }
  }, []);

  useEffect(() => {
    if (rep?.mutate.updateCursorPosition) {
      rep?.mutate.updateCursorPosition({
        ...props.user,
        x: mousePosition.left,
        y: mousePosition.top,
        twitchLogin: props.user.login,
      });
    }
  }, [mousePosition, rep]);

  return (
    <>
      <div className="video-player">
        <div
          ref={ratioConstrainedContainer}
          className="video-player__ratio-constrained"
          style={{
            ...constrainedDimensions,
          }}
        >
          {!hideMouse ? (
            <UserHover user={props.user} position={mousePosition} />
          ) : null}
          {/**
           * N.B. This is a bit of a silly limitation.
           *
           * Because the iFrame swallows all of the mouse events we cannot track the location
           * unless we block all mouse events going through to the frame. We have 2 options:
           *
           * 1. Connect the API to my channel to check if a stream is live or not.
           * 2. Specify a key to hold to click through to the player.
           * */}
          <div style={{ pointerEvents: "none", width: "100%", height: "100%" }}>
            <TwitchEmbedVideo
              targetClass="video-player__embed"
              channel="ericadamski"
              height="100%"
              width="100%"
              allowfullscreen={false}
              autoplay
              layout="video"
            />
          </div>
        </div>
      </div>
      <style jsx>{`
        :global(.video-player__embed) {
          width: 100%;
        }

        .video-player {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100vw;
          height: 100vh;
          padding: 2rem;
        }

        .video-player__ratio-constrained {
          position: relative;
          cursor: url("data:image/svg+xml,%3Csvg shape-rendering='geometricPrecision' xmlns='http://www.w3.org/2000/svg' width='32' height='32' fill='none'%3E%3Cg filter='url(%23filter0_d)'%3E%3Cpath fill='%23f81ce5' d='M9.63 6.9a1 1 0 011.27-1.27l11.25 3.75a1 1 0 010 1.9l-4.68 1.56a1 1 0 00-.63.63l-1.56 4.68a1 1 0 01-1.9 0L9.63 6.9z'/%3E%3Cpath stroke='%23fff' stroke-width='1.5' d='M11.13 4.92a1.75 1.75 0 00-2.2 2.21l3.74 11.26a1.75 1.75 0 003.32 0l1.56-4.68a.25.25 0 01.16-.16L22.4 12a1.75 1.75 0 000-3.32L11.13 4.92z'/%3E%3C/g%3E%3Cdefs%3E%3Cfilter id='filter0_d' width='32.26' height='32.26' x='.08' y='.08' filterUnits='userSpaceOnUse'%3E%3CfeFlood flood-opacity='0' result='BackgroundImageFix'/%3E%3CfeColorMatrix in='SourceAlpha' type='matrix' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'/%3E%3CfeOffset dy='4'/%3E%3CfeGaussianBlur stdDeviation='4'/%3E%3CfeColorMatrix type='matrix' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.12 0'/%3E%3CfeBlend in2='BackgroundImageFix' mode='normal' result='effect1_dropShadow'/%3E%3CfeBlend in='SourceGraphic' in2='effect1_dropShadow' mode='normal' result='shape'/%3E%3C/filter%3E%3C/defs%3E%3C/svg%3E")
              6 2,
            default;
        }
      `}</style>
    </>
  );
}
