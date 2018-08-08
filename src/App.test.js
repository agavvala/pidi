import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import AonawareServices from './services/AonawareServices'

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('fetches word info', () => {
  const service = new AonawareServices();
    service.fetchWordInformation("baffle")
})
