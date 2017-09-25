import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App.jsx';

React;
const renderApp = () => {
  ReactDOM.render(<App />, document.getElementById('app'));
};

renderApp();
if (module.hot) {
  module.hot.accept(() => {
    renderApp();
  });
}
