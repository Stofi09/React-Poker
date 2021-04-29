import React, { useContext } from "react";
import { cards, defaultCard } from "./Images/IndexImages";
import Button from "./Button";

const Player = ({
  playerCredit,
  setPlayerCredit,
  name,
  hasChecked,
  hasRaised,
  hasFolded,
  hasStarted,
  startGame,
  checkGame,
  playerCard1,
  playerCard2,
  turns,
  callRaise,
  firstRaise,
  oppRaise,
  overCall,
  hasCalledOverRaise,
  hasOppOnLine,
  foldGame,
}) => {
  const check = "Check";
  const raise = "Raise";
  const fold = "Fold";
  const start = "Start";
  if (turns < 1) {
    var card1 = defaultCard;
    var card2 = defaultCard;
  } else {
    var card1 = cards[playerCard1 - 1].name;
    var card2 = cards[playerCard2 - 1].name;
  }

  return (
    <div className="player-page-proba">
      <div className="playerContainer">
        <div className="playerInformation">
          <h4>You: {name}</h4>
          <h4>Credit: {playerCredit}</h4>
        </div>
        <div className="playerCard">
          <div className="playerCardContainer">
            <div className="player-card1">
              <img src={card1} alt="Paris" />
            </div>
            <div className="player-card2">
              <img src={card2} alt="Paris" />
            </div>
          </div>
        </div>
      </div>
      <div className="player player-buttons">
        <div className="player-buttons-container">
          <div className="player-check">
            <Button name={check} status={hasChecked} onClick={checkGame} />
          </div>
          <div className="player-start">
            <Button
              name={start}
              status={hasStarted && hasOppOnLine}
              onClick={startGame}
            />
          </div>
          <div className="player-fold">
            <Button name={fold} status={hasFolded} onClick={foldGame} />
          </div>
          <div className="playerRaise">
            <Button
              name={raise}
              status={hasRaised}
              credit={playerCredit}
              setPlayerCredit={setPlayerCredit}
              callRaise={callRaise}
              firstRaise={firstRaise}
              oppRaise={oppRaise}
              hasCalledOverRaise={hasCalledOverRaise}
              overCall={overCall}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Player;
