import React from 'react';
import { render } from 'react-dom';
import App from './app-logic-components/App';

const renderApp = () => {
  render(<App />, document.getElementById('app'));
};

renderApp();

if (module.hot) {
  module.hot.accept('./app-logic-components/App', () => {
    renderApp();
  });
}
