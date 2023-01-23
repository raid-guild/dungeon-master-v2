import actions from "./actions";

const reducer = (state: any, action: any) => {
  if (action.type === actions.TOGGLE_OPTION) {
    return {
      ...state,
      options: {
        ...state.options,
        [action.group]: {
          ...state.options[action.group],
          [action.option]: {
            ...state.options[action.group][action.option],
            active: !state.options[action.group][action.option].active,
          },
        },
      },
    };
  } else if (action.type === actions.UPDATE_OPTION_VALUE) {
    return {
      ...state,
      options: {
        ...state.options,
        [action.group]: {
          ...state.options[action.group],
          [action.option]: {
            ...state.options[action.group][action.option],
            [action.updateKey]: action.updateValue,
          },
        },
      },
    };
  }

  return state;
};

export default reducer;
