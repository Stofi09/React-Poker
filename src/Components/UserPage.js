import React,{useState} from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

const UserPage = ({ name, setName, sendMessage, oppName,connected}) => {
  const [open, setOpen] = useState(true);

  const inputTextHandler = (e) => {
    setName(e.target.value);
  };
  const handleClose = (e) => {
    e.preventDefault();
    if (name == "") {
      alert("You have to choose a name!");
    } else if (oppName == name) {
      alert("The name is already exsist!");
    } else if (oppName != name) {
      setName(name);
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
          ?<div style={{color: "red"}}>The client is waiting for the server. 
          It may take up to 30 seconds.</div>
          :<div>Enter your name</div>}
          </DialogContentText>
          <form className="form">
          <input value={name} onChange={inputTextHandler} type="text" className="form-input" />
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