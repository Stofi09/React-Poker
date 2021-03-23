import React,{useState} from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';




const UserPage = ({name,setName,sendMessage,oppName}) => {

    const [open, setOpen] = useState(true);
  

    const inputTextHandler = (e) => {
        setName(e.target.value);
    }
  
    const handleClose = (e) => {
        e.preventDefault();
        if(name == ""){
          alert("You have to choose a name!");
        }
        else if (oppName == name){
          alert("The name is already exsist!");
        } else if (oppName != name) {
        setName(name);
        setOpen(false);
        sendMessage();
        }

    };

    return (
        <div>
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Texas Poker</DialogTitle>
          {(oppName != "") ?  " "+ oppName + " is waiting for you!" : ""}
          <DialogContent>
            <DialogContentText>
            Enter your name:
            </DialogContentText>
                <form>
                    <input value={name}  onChange={inputTextHandler} type="text" />			
                    <button onClick={handleClose} type="submit"  className="primary" >Start Playing</button>
                </form>
          </DialogContent>
        </Dialog>
      </div>
    );
}
export default UserPage;