import React from 'react';
import ReactDOM from 'react-dom';

import Framework7 from 'framework7/lite-bundle';
import Framework7React from 'framework7-react';
Framework7.use(Framework7React)

//import 'framework7/framework7.css'; // use either this OR browser.css
import './browser.css';

import App from './components/app/app.component.js';
ReactDOM.render(<App />, document.getElementById('root'));

