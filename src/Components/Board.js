import React from 'react';
import {cards,card2,defaultCard} from "./Images/IndexImages";

const Board = ({boardCredit,card6,card7,card8,card9,card10,turns}) => {

   
    
    var card1 = defaultCard;
    var card2 = defaultCard;
    var card3 = defaultCard;
    var card4 = defaultCard;
    var card5 = defaultCard;
    if (turns == 0){
        var card1 = defaultCard;
        var card2 = defaultCard;
        var card3 = defaultCard;
        var card4 = defaultCard;
        var card5 = defaultCard;
    }
    if (turns>3){
        card5 = cards[(card10-1)].name;
    }
    if(turns>2){
        card4 = cards[(card9-1)].name;
    }
    if(turns>1){
        card1 = cards[(card6-1)].name;
        card2 = cards[(card7-1)].name;
        card3 = cards[(card8-1)].name;

    }


    
    
    return(
        <div className="board-page">
            <div className = "boardContainer">
            <div className="row">
                <div className="column"> 
                    <img src={card1} alt="Paris"/>
                </div> 
                <div className="column"> 
                    <img src={card2} alt="Paris"/>
                </div>
                <div className="column"> 
                    <img src={card3} alt="Paris"/>
                </div>
                <div className="column"> 
                    <img src={card4} alt="Paris"/>
                </div>
                <div className="column"> 
                    <img src={card5} alt="Paris"/>
                </div>    
            </div>
            <div className = "boardInformation">
                <div className="information-container">
                    <h4>Credit: {boardCredit}</h4>
                </div>
            </div>
            </div>
        </div>
    );
}

export default Board;