const SET_DARK_MODE = 'mode/SET_DARK_MODE';

const initialState = {isSet: false};

export const loadDarkModePOJO = (mode) => ({
  type: SET_DARK_MODE,
  payload: mode,
});


const reducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case SET_DARK_MODE:
      newState = Object.assign({}, state);
      newState.isSet = action.payload;
      console.log('mode', action.payload);
      return newState;
    default:
      return state;
  }
};

export default reducer;