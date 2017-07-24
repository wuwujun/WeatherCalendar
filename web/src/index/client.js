import 'normalize-css/normalize.css';

import React from 'react';
import ReactDom from 'react-dom';

import Root from './containers/Root';

import './styles/main.css';

ReactDom.render(
  <Root />,
  document.getElementById('app')
);
