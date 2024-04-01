export const GET_CART_LIST = "GET_CART_LIST";

export const get_cart_list = (input) => {
  return {
    type: GET_CART_LIST,
    payload: input,
  };
};
