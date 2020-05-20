import React from 'react';
import './App.css';
import GridView from '../GridView';
// Insert Location 7
import { withAuthenticator } from 'aws-amplify-react';


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <GridView />
      </header>
    </div>
  );
}

// Insert Location 8
export default withAuthenticator(App, true);
