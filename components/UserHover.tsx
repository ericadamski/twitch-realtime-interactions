import React from "react";
import { User } from "types/user";
import Image from "next/image";

interface Props {
  user: User;
  position: { left?: number; top?: number };
}

// handle this using https://github.com/rocicorp/replidraw/blob/master/frontend/collaborator.tsx
export default function UserHover(props: Props) {
  return (
    <>
      <div
        className="user-hover"
        style={{
          transform: `translate3d(${props.position.left ?? 0}px,${
            props.position.top ?? 0
          }px,0px)`,
        }}
      >
        <div className="user-hover__cursor" />
        <div className="user-hover__main">
          <div className="user-hover__avatar">
            <Image
              src={props.user.imageUrl}
              alt={`Twitch profile picture of ${props.user.displayName}`}
              width={32}
              height={32}
            />
          </div>
          {/* text field */}
          {/* mouse down ripple */}
        </div>
      </div>
      <style jsx>{`
        .user-hover {
          position: absolute;
        }

        .user-hover__avatar {
          overflow: hidden;
          border-radius: 50%;
          height: 30px;
          width: 30px;
          border: 2px solid #f81ce5;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </>
  );
}
