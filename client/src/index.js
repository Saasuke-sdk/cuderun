import React from 'react';
import ReactDOM from 'react-dom';
import './styles/normalize.css'
import './styles/index.css';
import CubeWorld from './components/CubeWorld';
import { Provider } from 'react-redux';
import store from './store';

// ReactDOM.render(
//   <React.StrictMode>
//     <CubeWorld bgColor='#141622' />
//   </React.StrictMode>,
//   document.getElementById('root')
// );

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
    <CubeWorld bgColor='#141622' />
    </Provider>
  </React.StrictMode>
)
