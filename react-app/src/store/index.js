// react-app/src/store/index.js
import session from "./session.js";
import profile from "./profile.js";
import mentions from "./mentions.js";
import posts from './posts.js';

import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";

const rootReducer = combineReducers({
  session,
  profile,
  mentions,
  posts,
});

let enhancer;

if (process.env.NODE_ENV === "production") {
  enhancer = applyMiddleware(thunk);
} else {
  const logger = require("redux-logger").default;
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

const configureStore = (preloadedState) => {
  return createStore(rootReducer, preloadedState, enhancer);
};

export default configureStore;
