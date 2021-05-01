import React, { useState, Component } from "react";
import "./App.css";
import UserPage from "./Components/UserPage";
import PokerPage from "./Components/PokerPage";
import Subscribe from "./Components/Subscribe";
import SockJsClient from "react-stomp";
import { findAllByDisplayValue } from "@testing-library/react";

// Make methods to reuse codes, one for restart->fold

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "",
      name: "",
      email: "",
      playerCredit: 0,
      oppName: "",
      oppCredit: 0,
      boardCredit: 0,
      oppRaise: 0,
      reCall: 0,
      overCall: 0,
      hasNotConnected: true,
      hasTurned: false,
      hasChecked: true,
      hasRaised: true,
      hasFolded: true,
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
      subscribeState: false
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
        this.setActions(false,false,false);
      } else {
        this.setState({ hasCalledOverRaise: false });
        this.setActions(true,true,true);
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
            type: this.state.playerCredit === 0 || this.state.oppCredit===0 ? "allIn" : "equalCall",
           
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
      this.setActions(true,true,true);
    }
  };

  beginGame = () => {
    this.clientRef.sendMessage(
      "/app/Join",
      JSON.stringify({
        name: this.state.name,
        email: this.state.email,
        message: this.state.typedMessage,
        credit: this.state.playerCredit,
        type: "Join",
      })
    );
  
    this.setActions(true,true,true);
    this.setState({ hasStarted: true });
  };

  startGame = () => {
    this.clientRef.sendMessage(
      "/app/start",
      JSON.stringify({
        name: this.state.name,
      })
    );
    this.setActions(false,false,false);
    this.setState({hasFolded: false})
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
    this.setActions(true,true,true);
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
    this.setActions(true,true,true);
    this.setState({ hasStarted: false });
    this.setState({ oppCredit: this.state.oppCredit + this.state.boardCredit });
    this.setState({ boardCredit: 0 });
  };

  subscribe = (email) => {
    this.clientRef.sendMessage(
      "/app/subscribe",
      JSON.stringify({
        name: this.state.name,
        email: email
      })
    );
    window.location.reload(false);
  };

 

  setActions = (hasChecked, hasFolded, hasRaised) => {
    this.setState({ hasChecked: hasChecked });
    this.setState({ hasRaised: hasRaised });
  };
  setRaises = (firstRaise, callRaise) => {
    this.setState({ firstRaise: firstRaise });
    this.setState({ callRaise: callRaise });
  };

  render() {
    return (
      <div className="background">
        Turn: {this.state.turns}
        <div className="App">
          <UserPage
            setName={this.setName}
            name={this.state.name}
            sendMessage={this.beginGame}
            oppName={this.state.oppName}
            connected={this.state.hasNotConnected}
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
          <Subscribe
            subscribeState={this.state.subscribeState}
            subscribe={this.subscribe}
          />
        </div>
        <SockJsClient
         url='http://localhost:5000/websocket-chat/'
          topics={["/topic/user"]}
          onConnect={() => {
            console.log("connected");
            this.setState({hasNotConnected: false});
          }}
          onDisconnect={() => {
            console.log("Disconnected");
            this.setState({hasNotConnected: true});
          }}
          onMessage={(msg) => {
           
            this.setState({ turns: msg.turn });
            console.log(msg.type);
            if (msg.type === "otherLeft") {
              alert(this.state.oppName + " has left the game. You win!");
              this.setState({
                playerCredit: this.state.playerCredit + this.state.boardCredit,
              });
              this.setState({ oppName: "" });
              this.setState({ oppCredit: 1000 });
              this.setState({ boardCredit: 0 });
              this.setActions(true, true, true);
              this.setState({hasStarted: true});
              this.setState({hasFolded: true});
              setTimeout(function() {
                window.location.reload(false);
              }, 3000);
            }
            
            // Check for result at the end of the game
            if (msg.turn == 5 && msg.type != "allIn") {
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
                alert("you won!");
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
              if (this.state.playerCredit === 0 ){
                alert("You lost the game!");
                setTimeout(
                  () => this.setState({ subscribeState: true }), 
                  3000
                );
              }else if (this.oppCredit === 0 ){
                alert("You won the game!");
                setTimeout(
                  () => this.setState({ subscribeState: true }), 
                  3000
                );
              }
              
              
            } else {
               if (msg.type === "allIn") {
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
                } 

            else  if (this.state.result == this.state.name) {
              alert("You won the game!");
              setTimeout(
                () => this.setState({ subscribeState: true }), 
                3000
              );
              } 
              else  {
                alert("You lost the game!");
                setTimeout(
                  () => this.setState({ subscribeState: true }), 
                  3000
                );
               
              }
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
              }
              else if (msg.type === "afterSubscribe"){
                if (this.state.name === msg.name){
                  window.location.reload(false);
                }
            }
              else if (msg.type === "Start") {
                this.setState({hasFolded: false})
                   this.setState({ turns: 0 });
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
              }
           
              else if (msg.type === "Check") {
                if (this.state.name !== msg.name) {
                  this.setActions(false, false, false);
                 
                }
              } else if (msg.type === "firstRaise") {
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
                }
                if (this.state.firstPLayer){
                  this.setActions(false, false, false);
                }
                else {
                  this.setActions(true, true, true);
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
