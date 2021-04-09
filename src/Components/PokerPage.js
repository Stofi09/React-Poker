import React from "react";
import Player from "./Player";
import Board from "./Board";
import Opponent from "./Opponent";

const PokerPage = ({
  name,
  oppName,
  hasOppOnLine,
  hasChecked,
  hasRaised,
  hasFolded,
  hasStarted,
  startGame,
  checkGame,
  playerCredit,
  setPlayerCredit,
  boardCredit,
  oppCredit,
  cards,
  turns,
  playerCard1,
  playerCard2,
  opponentCard1,
  opponentCard2,
  callRaise,
  firstRaise,
  oppRaise,
  hasCalledOverRaise,
  overCall,
  foldGame,
}) => {
  //For board
  const card5 = cards[4];
  const card6 = cards[5];
  const card7 = cards[6];
  const card8 = cards[7];
  const card9 = cards[8];

  return (
    <div>
      <div className="poker-page-container">
        <Opponent
          oppCredit={oppCredit}
          opponentName={oppName}
          hasOppOnLine={hasOppOnLine}
          opponentCard1={opponentCard1}
          opponentCard2={opponentCard2}
          turns={turns}
        />
        <Board
          boardCredit={boardCredit}
          card6={card5}
          card7={card6}
          card8={card7}
          card9={card8}
          card10={card9}
          turns={turns}
        />
        <Player
          name={name}
          playerCredit={playerCredit}
          setPlayerCredit={setPlayerCredit}
          hasChecked={hasChecked}
          hasRaised={hasRaised}
          hasFolded={hasFolded}
          hasStarted={hasStarted}
          startGame={startGame}
          checkGame={checkGame}
          callRaise={callRaise}
          playerCard1={playerCard1}
          playerCard2={playerCard2}
          turns={turns}
          firstRaise={firstRaise}
          oppRaise={oppRaise}
          hasCalledOverRaise={hasCalledOverRaise}
          overCall={overCall}
          hasOppOnLine={hasOppOnLine}
          foldGame={foldGame}
        />
      </div>
    </div>
  );
};

export default PokerPage;
