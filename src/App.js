import React, { useState, Component } from "react";
import "./App.css";
import UserPage from "./Components/UserPage";
import PokerPage from "./Components/PokerPage";
import SockJsClient from "react-stomp";
import { findAllByDisplayValue } from "@testing-library/react";

// Make methods to reuse codes, one for restart->fold

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "",
      name: "",
      playerCredit: 0,
      oppName: "",
      oppCredit: 0,
      boardCredit: 0,
      oppRaise: 0,
      reCall: 0,
      overCall: 0,
      hasTurned: false,
      hasChecked: true,
      hasRaised: true,
      hasFolded: false,
      hasOppOnLine: true,
      hasStarted: false,
      firstRaise: true,
      callRaise: false,
      hasCalledOverRaise: false,
      cards: [],
      turns: 0,
      firstPLayer: true,
      playerCard1: 0,
      playerCard2: 0,
      opponentCard1: 0,
      opponentCard2: 0,
      cardsValue: 0,
      result: " ",
    };
  }

  setName = (name) => {
    this.setState({ name: name });
  };

  setPlayerCredit = (credit) => {
    this.setState({ boardCredit: this.state.boardCredit + parseInt(credit) });
    this.setState({ playerCredit: this.state.playerCredit - credit });
    this.raiseGame(credit);
  };
  boolFuncOver = (b, value1, value2) => {
    var result = false;
    if (b) {
      if (+value1 === +value2) {
        result = true;
      }
    }
    return result;
  };
  boolFunc(firstRaise, value1, value2) {
    if (firstRaise) {
      if (value1 === value2) {
        return true;
      } else return false;
    } else return true;
  }
  equalFunc(callRaise, oppCredit, playerCredit) {
    console.log("bent vagy");
    if (callRaise && oppCredit === playerCredit) {
      return true;
    } else {
      return false;
    }
  }

  raiseGame = (credit) => {
    console.log("inside raiseGame");
    if (this.state.hasCalledOverRaise) {
      console.log("has called over raise");
      this.clientRef.sendMessage(
        this.state.playerCredit === 0 || this.state.oppCredit ===0? "/app/allIn" : "/app/calledOverRaise",
        JSON.stringify({
          name: this.state.name,
          credit: credit,
          type: this.state.playerCredit === 0 || this.state.oppCredit ===0? "allIn" : "calledOverRaise"
     //     type: "calledOverRaise",
        })
      );
      if (this.state.firstPLayer) {
        this.setState({ hasCalledOverRaise: false });
        this.setState({ hasChecked: false });
        this.setState({ hasRaised: false });
      } else {
        this.setState({ hasCalledOverRaise: false });
        this.setState({ hasChecked: true });
        this.setState({ hasRaised: true });
      }
      this.setState({ boardCredit: this.state.boardCredit + parseInt(credit) });
    } else {
      if (this.state.firstRaise) {
        this.setState({ hasTurned: true });
        console.log("first raise");
        this.clientRef.sendMessage(
          "/app/firstRaise",
          JSON.stringify({
            name: this.state.name,
            credit: credit,
            type: "firstRaise",
            hasTurned: this.state.hasTurned,
          })
        );
        this.setState({ firstRaise: false });
        this.setState({ hasTurned: false });
      } else if (this.state.callRaise && this.state.oppRaise == credit) {
        console.log("equal call to the raise");
        this.setState({ hasTurned: true });
        this.clientRef.sendMessage( this.state.playerCredit === 0 || this.state.oppCredit ===0 ? "/app/allIn" : "/app/equalCall",
         
          JSON.stringify({
            name: this.state.name,
            credit: credit,
            type: this.state.playerCredit === 0 || this.state.oppCredit===0 ? "allIn" : "calledOverRaise",
           // type: "equalCall",
            hasTurned: this.state.hasTurned,
          })
        );
        this.setState({ oppRaise: 0 });
        this.setState({ firstRaise: true });
        this.setState({ callRaise: false });
        this.setState({
          boardCredit: this.state.boardCredit + parseInt(credit),
        });
        this.setState({ hasTurned: false });
      } else if (this.state.callRaise && this.state.oppRaise < credit) {
        console.log("call is higher than oppCall");
        this.setState({ hasTurned: true });
        this.clientRef.sendMessage(
          "/app/overCall",
          JSON.stringify({
            name: this.state.name,
            credit: credit,
            overCall: parseInt(credit) - this.state.oppRaise,
            type: "overCall",
            hasTurned: this.state.hasTurned,
          })
        );
        this.setState({ oppRaise: 0 });
        this.setState({ firstRaise: false });
        this.setState({ callRaise: false });
        this.setState({
          boardCredit: this.state.boardCredit + parseInt(credit),
        });
        this.setState({ hasTurned: false });
      }
      this.setState({ hasChecked: true });
      // this.setState({hasFolded: true});
      this.setState({ hasRaised: true });
    }
  };

  beginGame = () => {
    this.clientRef.sendMessage(
      "/app/Join",
      JSON.stringify({
        name: this.state.name,
        message: this.state.typedMessage,
        credit: this.state.playerCredit,
        type: "Join",
      })
    );
    this.setState({ hasChecked: true });
    //  this.setState({hasFolded: true});
    this.setState({ hasRaised: true });
    this.setState({ hasStarted: true });
  };

  startGame = () => {
    this.clientRef.sendMessage(
      "/app/start",
      JSON.stringify({
        name: this.state.name,
      })
    );
    this.setState({ hasChecked: false });
    //  this.setState({hasFolded: false});
    this.setState({ hasRaised: false });
    this.setState({ hasStarted: true });
    this.setState({ firstPLayer: true });
  };

  checkGame = () => {
    this.setState({ hasTurned: true });
    this.clientRef.sendMessage(
      "/app/check",
      JSON.stringify({
        name: this.state.name,
        check: this.state.hasChecked,
        raise: this.state.hasRaised,
        fold: this.state.hasFolded,
        hasTurned: this.state.hasTurned,
      })
    );
    this.setState({ hasChecked: true });
    // this.setState({hasFolded: true});
    this.setState({ hasRaised: true });
    this.setState({ hasTurned: false });
  };

  //  connect with button, make buttons disable except start, take credit from player, make a serverside receiver
  foldGame = () => {
    this.clientRef.sendMessage(
      "/app/fold",
      JSON.stringify({
        name: this.state.name,
      })
    );
    this.setState({ hasChecked: true });
    //   this.setState({hasFolded: true});
    this.setState({ hasRaised: true });
    this.setState({ hasStarted: false });
    this.setState({ oppCredit: this.state.oppCredit + this.state.boardCredit });
    this.setState({ boardCredit: 0 });
  };

  setActions = (hasChecked, hasFolded, hasRaised) => {
    this.setState({ hasChecked: hasChecked });
    //  this.setState({hasFolded: hasFolded});
    this.setState({ hasRaised: hasRaised });
  };
  setRaises = (firstRaise, callRaise) => {
    this.setState({ firstRaise: firstRaise });
    this.setState({ callRaise: callRaise });
  };

  render() {
    return (
      <div className="asd">
        <div className="App">
          <UserPage
            setName={this.setName}
            name={this.state.name}
            sendMessage={this.beginGame}
            oppName={this.state.oppName}
          />
          <PokerPage
            name={this.state.name}
            oppName={this.state.oppName}
            hasOppOnLine={this.state.hasOppOnLine}
            hasChecked={this.state.hasChecked}
            hasRaised={this.state.hasRaised}
            hasFolded={this.state.hasFolded}
            hasStarted={this.state.hasStarted}
            startGame={this.startGame}
            checkGame={this.checkGame}
            foldGame={this.foldGame}
            playerCredit={this.state.playerCredit}
            setPlayerCredit={this.setPlayerCredit}
            oppCredit={this.state.oppCredit}
            boardCredit={this.state.boardCredit}
            cards={this.state.cards}
            turns={this.state.turns}
            firstPLayer={this.state.firstPLayer}
            playerCard1={this.state.playerCard1}
            playerCard2={this.state.playerCard2}
            opponentCard1={this.state.opponentCard1}
            opponentCard2={this.state.opponentCard2}
            callRaise={this.state.callRaise}
            firstRaise={this.state.firstRaise}
            oppRaise={this.state.oppRaise}
            hasCalledOverRaise={this.state.hasCalledOverRaise}
            overCall={this.state.overCall}
          />
        </div>
        <SockJsClient
          url='http://localhost:5000/websocket-chat/'
          topics={["/topic/user"]}
          onConnect={() => {
            console.log("connected");
          }}
          onDisconnect={() => {
            console.log("Disconnected");
          }}
          onMessage={(msg) => {
            console.log(msg.type);
            if (msg.type === "otherLeft") {
              alert(this.state.oppName + " has left the game. You win!");
              this.setState({
                playerCredit: this.state.playerCredit + this.state.boardCredit,
              });
              this.setState({ oppName: "" });
              this.setState({ oppCredit: 1000 });
              this.setState({ boardCredit: 0 });
            }
            
            // Check for result at the end of the game
            if (msg.turn == 6) {
              console.log("inside 6th turn");
              if (this.state.result == "draw") {
                alert("draw");
                this.setState({
                  playerCredit:
                    this.state.playerCredit + this.state.boardCredit / 2,
                });
                this.setState({
                  oppCredit: this.state.oppCredit + this.state.boardCredit / 2,
                });
                this.setState({ boardCredit: 0 });
              } else if (this.state.result == this.state.name) {
                alert("you wonasd!");
                this.setState({
                  playerCredit:
                    this.state.playerCredit + this.state.boardCredit,
                });
                this.setState({ boardCredit: 0 });
              } else {
                alert("you lost.");
                this.setState({
                  oppCredit: this.state.oppCredit + this.state.boardCredit,
                });
                this.setState({ boardCredit: 0 });
              }
              this.setState({ hasStarted: false });
              this.setState({ turns: 0 });
              // Checking if one of the players lost the game.
              if (this.state.oppCredit === 0) {
                alert("You won the game!");
            //    window.location.reload(false);
                this.setActions(true, true, true);
                this.setState({hasOppOnLine:true});
                this.setState({ hasStarted: true });
              } 
              if (this.state.playerCredit === 0) {
                alert("You lost the game!");
             //   window.location.reload(false);
                this.setActions(true, true, true);
                this.setState({hasOppOnLine:true});
                this.setState({ hasStarted: true });
              }
            } else {
              //duplicate code
              if (msg.type === "allIn"){
                console.log("logging all in.");
                this.setState({ turns: msg.turn });
                if (this.state.result == "draw") {
                  alert("draw");
                  this.setState({
                    playerCredit:
                      this.state.playerCredit + this.state.boardCredit / 2,
                  });
                  this.setState({
                    oppCredit: this.state.oppCredit + this.state.boardCredit / 2,
                  });
                  this.setState({ boardCredit: 0 });
                } else {
                  this.setState({ hasStarted: false });
                  this.setState({ playerCredit: 0});
                  this.setState({ boardCredit: 0 });
                  this.setState({ oppCredit: 0 });  
                  this.setActions(true, true, true);
                  this.setState({hasOppOnLine:true});
                  this.setState({ hasStarted: true });    
                 if (this.state.result == this.state.name) {
                  alert("you won!");
                  console.log("inside you won");
                   alert("You won the game!");
                } else {
                  alert("you lost the game.");
                  console.log("lost game.");
                }
              }
              setTimeout(function() {
                window.location.reload(false);
              }, 3000);
              } 
              if (msg.type === "Join") {
                if (this.state.name !== msg.name && this.state.oppName !== "") {
                  this.setState({ oppName: msg.name });
                  this.setState({ hasOppOnLine: false });
                }
                if (this.state.name === msg.name) {
                  if (this.state.id === "") {
                    this.setState({ id: msg.id });
                  }
                  this.setState({ playerCredit: msg.credit });
                  this.setState({ oppCredit: msg.oppCredit });
                  this.setState({ oppName: msg.oppName });
                }
                if (this.state.name !== msg.name) {
                  this.setState({ oppCredit: msg.credit });
                  this.setState({ oppName: msg.name });
                }
              } else if (msg.type === "reloadPage") {
                if (this.state.id === "") {
                  window.location.reload(false);
                }
              } else if (msg.type === "Start") {
      
                if (this.state.name !== msg.name) {
                  this.setActions(true, true, true);
                  this.setState({ hasStarted: true });
                  this.setState({ firstPLayer: false });
                  this.setState({ cards: msg.cards });
                  this.setState({ playerCard1: msg.cards[2] });
                  this.setState({ playerCard2: msg.cards[3] });
                  this.setState({ opponentCard1: msg.cards[0] });
                  this.setState({ opponentCard2: msg.cards[1] });
                  this.setState({ oppName: msg.name });
                } else {
                  this.setState({ cards: msg.cards });
                  this.setState({ playerCard1: msg.cards[0] });
                  this.setState({ playerCard2: msg.cards[1] });
                  this.setState({ opponentCard1: msg.cards[2] });
                  this.setState({ opponentCard2: msg.cards[3] });
                }
                this.setState({ result: msg.result });
                
                this.setState({ hasOppOnLine: true });
             
              } else if (msg.type === "Check") {
                if (this.state.name !== msg.name) {
                  this.setActions(false, false, false);
                  this.setState({ turns: msg.turn });
                }
              } else if (msg.type === "firstRaise") {
                console.log("raise");
                console.log(msg.oppRaise);

                if (this.state.name != msg.name) {
                  this.setActions(true, false, false);
                  this.setState({
                    boardCredit: this.state.boardCredit + msg.credit,
                  });
                  this.setState({
                    oppCredit: this.state.oppCredit - msg.credit,
                  });
                  this.setState({ oppRaise: msg.credit });
                  this.setState({ firstRaise: false });
                  this.setState({ callRaise: true });
                }
                this.setState({ turns: msg.turn });
              } else if (msg.type === "equalCall") {
                if (this.state.name != msg.name) {
                  this.setActions(false, false, false);
                  this.setState({
                    boardCredit: this.state.boardCredit + msg.credit,
                  });
                  this.setState({
                    oppCredit: this.state.oppCredit - msg.credit,
                  });
                  this.setRaises(true, false);
                  console.log(
                    this.state.name +
                      "" +
                      this.state.boardCredit +
                      " " +
                      msg.credit
                  );
                }
              } else if (msg.type === "overCall") {
                if (this.state.name != msg.name) {
                  this.setActions(true, false, false);
                  this.setState({
                    boardCredit: this.state.boardCredit + msg.credit,
                  });
                  this.setState({
                    oppCredit: this.state.oppCredit - msg.credit,
                  });
                  this.setRaises(false, false);
                  this.setState({ overCall: msg.overCall });
                  this.setState({ hasCalledOverRaise: true });
                  alert("You have to raise: " + this.state.overCall);
                }
              } else if (msg.type === "calledOverRaise") {
                if (this.state.name != msg.name) {
                  console.log("overRaise has called");
                  if (this.state.firstPLayer) {
                    this.setActions(false, false, false);
                  } else {
                    this.setActions(true, true, true);
                  }
                  this.setState({
                    boardCredit: this.state.boardCredit + msg.credit,
                  });
                  this.setState({
                    oppCredit: this.state.oppCredit - msg.credit,
                  });
                  this.setRaises(true, false);
                }
              }
              if (msg.type === "Fold") {
                if (this.state.name != msg.name) {
                  this.setState({
                    playerCredit:
                      this.state.playerCredit + this.state.boardCredit,
                  });
                  this.setState({ boardCredit: 0 });
                  this.setActions(true, true, true);
                  this.setState({ hasStarted: false });
                  this.setState({ turns: 0 });
                }
              }
            }
          }}
          ref={(client) => {
            this.clientRef = client;
          }}
        />
      </div>
    );
  }
}
export default App;
