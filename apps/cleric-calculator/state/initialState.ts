import _ from "lodash";
import { allOptions } from "../utils/constants";

const initialState = {
  options: allOptions,
  error: null,
  loading: false,
};

export default initialState;
