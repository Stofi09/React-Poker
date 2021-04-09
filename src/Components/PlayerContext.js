import React, { useState, createContext } from "react";

export const PlayerContext = createContext();

export const PlayerProvider = (props) => {
  const [players, setPlayer] = useState("");

  return (
    <PlayerContext.Provider value={[players, setPlayer]}>
      {props.children}
    </PlayerContext.Provider>
  );
};
