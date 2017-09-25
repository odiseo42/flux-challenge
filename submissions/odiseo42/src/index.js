import React from 'react';
import { Provider } from 'react-redux';
import App from './containers/App';
import configureStore from './store/configureStore';
import ReactDOM from 'react-dom';

const store = configureStore();

React;
const renderApp = () => {
  ReactDOM.render(<Provider store={store}>
    <App />
  </Provider>, document.getElementById('app'));
};

renderApp();
if (module.hot) {
  module.hot.accept(() => {
    renderApp();
  });
}
