import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

import Page from './Page';

function App() {
  return (
    <React.Fragment>
      <AppBar position="static">
        <Toolbar>
          Example App
        </Toolbar>
      </AppBar>
      <Page />
      
    </React.Fragment>
  );
}

export default App;
