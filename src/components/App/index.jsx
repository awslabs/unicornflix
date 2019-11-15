import React from 'react';
import './App.css';
import Amplify from 'aws-amplify';
import { withAuthenticator } from 'aws-amplify-react';
import GridView from '../GridView';
import awsconfig from '../../aws-exports';

Amplify.configure(awsconfig);

function App() {
  return (
    <div className="App">
      <header className="App-header">

        <GridView />
      </header>
    </div>
  );
}

export default withAuthenticator(App, true);
