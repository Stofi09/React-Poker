import React, { useState } from 'react';

import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const Subscribe = ({subscribeState,subscribe}) =>{

  const [email, setEmail] = useState("");

  const inputTextHandler = (e) => {
    setEmail(e.target.value);
  };

  const handleClose = (e) => {
    e.preventDefault();
    subscribe(email);
  };

  return (
    <div>
      <Dialog open={subscribeState} onClose={handleClose} aria-labelledby="form-dialog-title" disableBackdropClick="true">
        <DialogTitle id="form-dialog-title">Subscribe</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Thank you, for trying out this game. If you would like to receive a summary regarding your performance please subscribe.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Email Address"
            type="email"
            fullWidth
            value={email} onChange={inputTextHandler}
          />
        </DialogContent>
        <DialogActions>
          <button onClick={handleClose} type="submit" className="primary">
            Cancel
          </button>
          <button onClick={handleClose} type="submit" className="primary">
            Subscribe
          </button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
export default Subscribe;