import * as types from "./ActionTypes";

const initialState = {
    chain: null,
    orders: [],
    loading: false,
    error: null,
};

const optionsReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.GET_OPTION_CHAIN_REQUEST:
        case types.PLACE_OPTION_ORDER_REQUEST:
        case types.GET_USER_OPTION_ORDERS_REQUEST:
            return { ...state, loading: true, error: null };

        case types.GET_OPTION_CHAIN_SUCCESS:
            return { ...state, loading: false, chain: action.payload };

        case types.PLACE_OPTION_ORDER_SUCCESS:
            return { 
                ...state, 
                loading: false, 
                orders: [...state.orders, action.payload] 
            };

        case types.GET_USER_OPTION_ORDERS_SUCCESS:
            return { ...state, loading: false, orders: action.payload };

        case types.GET_OPTION_CHAIN_FAILURE:
        case types.PLACE_OPTION_ORDER_FAILURE:
        case types.GET_USER_OPTION_ORDERS_FAILURE:
            return { ...state, loading: false, error: action.payload };

        default:
            return state;
    }
};

export default optionsReducer;
