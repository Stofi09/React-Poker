import React from "react";
import { cards, defaultCard } from "./Images/IndexImages";

const Opponent = ({
  oppCredit,
  opponentName,
  hasOppOnLine,
  opponentCard1,
  opponentCard2,
  turns,
}) => {
  if (turns == 5) {
    var card1 = cards[opponentCard1 - 1].name;
    var card2 = cards[opponentCard2 - 1].name;
  } else {
    var card1 = defaultCard;
    var card2 = defaultCard;
  }

  // if (turns<1){

  //   var card1 = defaultCard;
  // var card2 = defaultCard;
  //} else {
  //var card1 = cards[(opponentCard1-1)].name;
  //var card2 = cards[(opponentCard2-1)].name;
  // }

  return (
    <div className="opponent-page" disabled={hasOppOnLine}>
      <div className="opponentContainer">
        <div className="opponentInformation">
          <h4>Name:{opponentName}</h4>
          <h4>Credit:{oppCredit}</h4>
        </div>
        <div className="opponentCard">
          <div className="card-container-opponent2">
            <div className="opponent-card1">
              <img src={card1} alt="Paris" />
            </div>
            <div className="opponent-card2">
              <img src={card2} alt="Paris" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Opponent;
