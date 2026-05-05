package com.zosh.service;

import com.zosh.model.OptionOrder;
import com.zosh.model.User;
import com.zosh.response.OptionChainResponse;
import java.util.List;

public interface OptionsService {
    OptionChainResponse getOptionChain(String symbol);
    OptionOrder placeOptionOrder(User user, OptionOrder orderRequest) throws Exception;
    List<OptionOrder> getUserOptionOrders(User user);
}
