import api from "@/Api/api";
import * as types from "./ActionTypes";

export const getOptionChain = (symbol) => async (dispatch) => {
    dispatch({ type: types.GET_OPTION_CHAIN_REQUEST });
    try {
        const response = await api.get(`/api/options/chain/${symbol}`);
        dispatch({ type: types.GET_OPTION_CHAIN_SUCCESS, payload: response.data });
    } catch (error) {
        dispatch({ type: types.GET_OPTION_CHAIN_FAILURE, payload: error.message });
    }
};

export const placeOptionOrder = ({ jwt, orderRequest }) => async (dispatch) => {
    dispatch({ type: types.PLACE_OPTION_ORDER_REQUEST });
    try {
        const response = await api.post('/api/options/order', orderRequest, {
            headers: { Authorization: `Bearer ${jwt}` }
        });
        dispatch({ type: types.PLACE_OPTION_ORDER_SUCCESS, payload: response.data });
    } catch (error) {
        dispatch({ type: types.PLACE_OPTION_ORDER_FAILURE, payload: error.message });
    }
};

export const getUserOptionOrders = (jwt) => async (dispatch) => {
    dispatch({ type: types.GET_USER_OPTION_ORDERS_REQUEST });
    try {
        const response = await api.get('/api/options/my-orders', {
            headers: { Authorization: `Bearer ${jwt}` }
        });
        dispatch({ type: types.GET_USER_OPTION_ORDERS_SUCCESS, payload: response.data });
    } catch (error) {
        dispatch({ type: types.GET_USER_OPTION_ORDERS_FAILURE, payload: error.message });
    }
};
