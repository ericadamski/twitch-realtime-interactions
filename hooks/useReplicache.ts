import { useEffect, useState } from "react";
import { Replicache } from "replicache";

import * as Mutators from "lib/mutators";

export function useReplicache() {
  const [rep, setRep] = useState<Replicache>();

  useEffect(() => {
    setRep(
      new Replicache({
        wasmModule: "/replicache.wasm",
        pushURL: "/api/replicache/push",
        pullURL: "/api/replicache/pull",
        mutators: Mutators,
      })
    );
  }, []);

  return rep;
}
