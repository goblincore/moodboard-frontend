import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router} from 'react-router-dom';
import { Provider } from 'react-redux'
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import {loadAuthToken} from './local-storage';
import './index.css';
import App from './components/home/App';
import registerServiceWorker from './registerServiceWorker';
import { imagesReducer} from './reducers';
import { authReducer} from './reducers/auth';
import {reducer as formReducer} from 'redux-form';
import {moodboardReducer} from './reducers/moodboards';
import {setAuthToken, refreshAuthToken} from './actions/auth';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const rootReducer = combineReducers({images:imagesReducer,auth:authReducer, form:formReducer, moodboards:moodboardReducer});

const store = createStore(
    rootReducer,composeEnhancers(
    applyMiddleware(thunk)
));

ReactDOM.render(
 <Provider store={store}>
     <Router>
       <App />
      </Router>
  </Provider>,
   document.getElementById('root')
  );
registerServiceWorker();

// Hydrate the authToken from localStorage if it exist
const authToken = loadAuthToken();
if (authToken) {
    const token = authToken;
    store.dispatch(setAuthToken(token));
    store.dispatch(refreshAuthToken());
}