import { GET_CART_LIST } from "../actions/user_cart_action";

const initState = {
  data: {},
  loading: false,
  error: false,
  errorData: {},
};

const user_cart_reducer = (state = initState, { payload, type }) => {
  if (type === GET_CART_LIST) {
    state = { ...state, loading: false, data: payload };
  }

  return state;
};

export default user_cart_reducer;
