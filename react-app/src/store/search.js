// frontend/src/store/search.js

const SET_ONE_SEARCH = 'session/SET_ONE_SEARCH';
const REMOVE_ONE_SEARCH = 'session/REMOVE_ONE_SEARCH';

export const setSearchPOJO = (search) => ({
  type: SET_ONE_SEARCH,
  search
});

export const removeSearchPOJO = () => ({
  type: REMOVE_ONE_SEARCH
});

const initialState = [];

const searchReducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case SET_ONE_SEARCH:
      // newState = JSON.parse(JSON.stringify(state));
      // newState.push(JSON.parse(JSON.stringify(action.search)));
      newState = JSON.parse(JSON.stringify(action.search));
      return newState;
    default:
      return state;
  }
};

export default searchReducer;