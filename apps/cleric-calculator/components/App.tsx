import React, { useReducer } from "react";
import { ethers, BigNumber } from "ethers";
import { RGThemeProvider } from "@raidguild/design-system";
import CalculatorForm from "./CalculatorForm";
import initialState from "../state/initialState";
import reducer from "../state/reducer";
import actions from "../state/actions";

const App: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const toggleOption = (group: string, option: string) => {
    dispatch({
      type: actions.TOGGLE_OPTION,
      group,
      option,
    });
  };

  const updateOptionValue = (
    group: string,
    option: string,
    key: string,
    value: number
  ) => {
    dispatch({
      type: actions.UPDATE_OPTION_VALUE,
      group,
      option,
      updateKey: key,
      updateValue: value,
    });
  };

  return (
    <RGThemeProvider>
      <CalculatorForm
        options={state.options}
        toggleOption={toggleOption}
        updateOptionValue={updateOptionValue}
      />
    </RGThemeProvider>
  );
};

export default App;
