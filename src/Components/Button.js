import React, { useState } from "react";

const Button = ({
  name,
  status,
  onClick,
  credit,
  setPlayerCredit,
  callRaise,
  firstRaise,
  oppRaise,
  overCall,
  hasCalledOverRaise,
}) => {
  const [newCredit, setNewCredit] = useState(0);

  const inputTextHandler = (e) => {
    setNewCredit(e.target.value);
  };

  const handleClose = (e) => {
    e.preventDefault();
    if (newCredit == "") {
      alert("Field is empty.");
    } else {
      if (newCredit > credit) {
        alert("Bid is too high! Available credit is: " + credit);
      } else {
        if (callRaise) {
          if (oppRaise > newCredit) {
            alert(
              "Bid is low, it has to be equal or higher than opponents raise: " +
                oppRaise
            );
          } else {
            setPlayerCredit(newCredit);
            setNewCredit(0);
          }
        } else if (hasCalledOverRaise) {
          if (overCall == newCredit) {
            setPlayerCredit(newCredit);
            setNewCredit(0);
          } else {
            alert("The call has to be equal to the over call: " + overCall);
          }
        } else {
          setPlayerCredit(newCredit);
          setNewCredit(0);
        }
      }
    }
  };

  if (name === "Raise") {
    return (
      <div className="raiseContainer">
        <form>
          <button
            onClick={handleClose}
            type="submit"
            className="primary"
            disabled={status}
          >
            {name}
          </button>
          <input
            className="proba"
            type="text"
            value={newCredit}
            autoComplete="off"
            onChange={inputTextHandler}
          />
        </form>
      </div>
    );
  } else {
    return (
      <div>
        <button
          onClick={onClick}
          type="button"
          className="primary"
          disabled={status}
        >
          {name}
        </button>
      </div>
    );
  }
};
export default Button;
