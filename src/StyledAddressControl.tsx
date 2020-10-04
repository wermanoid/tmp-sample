import React, { useState } from 'react';
import { TextField, IconButton, Dialog, DialogTitle } from '@material-ui/core';
import styled from '@emotion/styled';
import BorderClearIcon from '@material-ui/icons/BorderClear';
import { awaitInput } from './Page';
interface UseEtheriumAddersHook {
  addressState: {
    error: boolean;
    address: string;
  };
  updateAddress: (newAddr: string) => void;
}

export const useEtheriumAddress = (): UseEtheriumAddersHook => {
  const [state, setState] = useState({ error: false, address: '0xfFfa5813ED9a5DB4880D7303DB7d0cBe41bC771F' });

  return {
    addressState: state,
    updateAddress: awaitInput((newAddr: string) => setState({
      error: !/0x[0-9a-fA-F]{40}$/.test(newAddr),
      address: newAddr
    }))
  };
};
const getQrRef = (addr: string) => `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${addr}`;

const AddressControl: React.FC<{ className?: string; state: UseEtheriumAddersHook; }> = ({ className, state }) => {
  const [opened, setOpen] = useState(false);


  return (
    <React.Fragment>
      <div className={className}>
        <TextField
          className="input"
          error={state.addressState.error}
          id="filled-error-helper-text"
          label="Ethereum address"
          value={state.addressState.address}
          onChange={e => {
            state.updateAddress(e.currentTarget.value);
          }}
          helperText={state.addressState.error ? "Addres should have format: 0x[0-9a-fA-F]{40}$" : null}
          variant="outlined" />
        <IconButton className="qr" onClick={() => setOpen(true)} disabled={state.addressState.error}> <BorderClearIcon /> </IconButton>
      </div>
      <Dialog open={opened} onClose={() => setOpen(false)}>
        <DialogTitle id="simple-dialog-title">Addres QR Code</DialogTitle>
        <img src={getQrRef(state.addressState.address)} alt="Should be QR" />
      </Dialog>
    </React.Fragment>
  );
};

export const StyledAddressControl = styled(AddressControl)`
  .input {
    width: 100%;
    float: left;
  }
  .qr {
    float: left;
  }
`;

export default StyledAddressControl;
