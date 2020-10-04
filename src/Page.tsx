import React, { useState, useMemo } from 'react';
import { Paper, Select, MenuItem, FormControl, InputLabel, Button  } from '@material-ui/core';
import styled from '@emotion/styled'
import { throttle } from 'lodash/fp';

import { EtherClient, Networks, Transaction, ApiResponse } from './ApiClient';
import TransactionsList from './TransactionsList';
import AddressInput, { useEtheriumAddress } from './StyledAddressControl';

const PageContainer = styled.section`
  padding:20px;
  flex: 1;
  & > * {
    width: 100%;
    max-width: 1024px;
    margin: auto;
    display: flex;
    background-color: #fff;
    margin-top: 15px;
  }
`;

const PageContent = styled(Paper)`
  padding: 20px;
  width: initial;
  max-width: 984px;
  display: flex;
  flex-direction: column;
`;

const DropDown = styled(Select)`
  padding: 12px;
`;

type MuiEvent = {
  name?: string | undefined;
  value: unknown;
};

export const awaitInput = throttle(400);

interface PreviousAddrProps {
  addrs: string[];
  active: string;
  onUpdate: (arg: string) => void;
};

const PreviousAddr: React.FC<PreviousAddrProps> = ({ addrs, active, onUpdate }) => addrs.length ? (
  <DropDown
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={addrs.indexOf(active) === -1 ? addrs[0] : active}
        onChange={event => onUpdate(event.target.value as string)}
      >
        {addrs.map(addr => <MenuItem value={addr} key={addr}>{addr}</MenuItem>)}        
      </DropDown>
) : null;

const Page: React.FC = () => {
  const [usedAddresses, setUsedAddrs] = useState<string[]>([]);
  const inputData = useEtheriumAddress();
  const [network, setNetwork] = useState(Networks.Rinkeby);
  const [balance, setBalance] = useState('');
  const [dataState, setData] = useState<{
    loading: boolean,
    transactions: Transaction[]
  }>({
    loading: false,
    transactions: []
  });

  const client = useMemo(() => new EtherClient(network), [network]);

  const handleChange = (event: React.ChangeEvent<MuiEvent>) => {
    setNetwork(event.target.value as Networks);
  };

  const onCheckClick = () => {
    const addr = inputData.addressState.address;

    setData({
      loading: true,
      transactions: []
    });

    Promise.all([
      client.getAccountBalance(addr),
      client.getAccountTransactions(addr)
    ])
    .then(([balance, transactions]) => {
      setBalance(balance.result);
      setData({
        loading: false,
        transactions: transactions.result.slice(0, 9)
      })
    }).catch(() => {
      setBalance('Can\'t retrieve data...')
      setData({
        loading: false,
        transactions: []
      })
    })


    // client.getAccountTransactions(addr)
    //   .then((response: ApiResponse) => {
    //     if (usedAddresses.indexOf(addr) === -1) {
    //       setUsedAddrs([addr, ...usedAddresses.slice(0, 4)])
    //     }
        
    //   })
    //   .catch(() => {
    //     setData({
    //       loading: false,
    //       transactions: []
    //     })
    //   })
  }

  return (
    <PageContainer>
      <PreviousAddr
        addrs={usedAddresses}
        active={inputData.addressState.address}
        onUpdate={inputData.updateAddress}
      />
      <AddressInput state={inputData} />
      <FormControl variant="outlined">
        <InputLabel id="demo-simple-select-outlined-label">Network</InputLabel>
      <DropDown
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={network}
        onChange={handleChange}
      >
        <MenuItem value={Networks.Rinkeby}>Rinkeby</MenuItem>
        <MenuItem value={Networks.Mainnet}>Mainnet</MenuItem>
      </DropDown>
      </FormControl>
      <Button 
        variant="outlined"
        color="primary"
        onClick={onCheckClick}
        disabled={inputData.addressState.error}
      >
          Search
      </Button>
      <PageContent elevation={2}>
        <div>
        <h4>Actual balance: {balance}</h4>
        </div>
        <TransactionsList {...dataState} />
      </PageContent>
    </PageContainer>
  )
}

export default Page;
