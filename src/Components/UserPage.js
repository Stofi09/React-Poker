import React,{useState} from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

const UserPage = ({  setValues, sendMessage, oppName,connected  }) => {
  const [open, setOpen] = useState(true);

  const [state, setState] = React.useState({
    playerName: "",
    email: "",
  })

  function handleChange(evt) {
    const value = evt.target.value;
    setState({
      ...state,
      [evt.target.name]: value
    });
  }

  const handleClose = (e) => {
    e.preventDefault();
    if (state.playerName == "") {
      alert("You have to choose a name!");
    } else if (oppName == state.playerName) {
      alert("The name is already exsist!");
    } else if (oppName != state.playerName) {
      setValues(state.playerName,state.email);
      setOpen(false);
      sendMessage();
    }
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Texas Poker</DialogTitle>
        {oppName != "" ? " " + oppName + " is waiting for you!" : ""}
        <DialogContent>
          <DialogContentText>{(connected)
          ?<div style={{color: "red"}}>The client is waiting for the server.</div>
          :<div>Enter your name</div>}
          </DialogContentText>
          <form className="form">
            <input name="playerName" value={state.playerName} onChange={handleChange} type="text" className="form-input" />
            <input name="email" value={state.email} onChange={handleChange} type="text" className="form-input" />
            <button onClick={handleClose} type="submit" className="primary" disabled={connected}>
              Start Playing
            </button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default UserPage;