import React from 'react';
import { List, ListItem } from '@material-ui/core';
import styled from '@emotion/styled';

import { Transaction } from './ApiClient';

const TransactionList = styled(List)`
  width: 100%;
`;

const Transation = styled(ListItem)`
  &:hover {
    background-color: #a6afbf;
    cursor: pointer;
  }

  &:nth-child(2n + 1) {
    background-color: #d6ebff;

    &:hover {
      background-color: #a6afbf;
    }
  }
`;

export interface TransactionsListProps {
  transactions: Transaction[];
  loading?: boolean;
};

const TransactionsList: React.FC<TransactionsListProps> = ({
  transactions,
  loading
}) => {
  if (loading) {
    return <h2>Retrieving data...</h2>
  }

  if (!transactions.length) {
    return <div>No data provided...</div>;
  }

  return (
    <TransactionList>
      {transactions.map(tr => (
        <Transation key={tr.blockHash} button onClick={() => console.log(tr)}>
          <div>
            <div>FROM: {tr.from}</div>
            <div>TO: {tr.to}</div>
            <div>Date: { new Date(Number(tr.timeStamp)).toLocaleString()}</div>
          </div>
        </Transation>
      ))}
    </TransactionList>
  );
};

export default TransactionsList;
