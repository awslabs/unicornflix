/* eslint-env browser */
import ReactDOM from 'react-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.css';
import * as serviceWorker from './serviceWorker';
import Routing from './components/Router';
// Insert Location 1


ReactDOM.render(Routing, document.getElementById('root'));

serviceWorker.unregister();
