package com.zosh.controller;

import com.zosh.model.CoinDTO;
import com.zosh.model.Order;
import com.zosh.model.User;
import com.zosh.model.Wallet;
import com.zosh.request.PromptBody;
import com.zosh.response.ApiResponse;
import com.zosh.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController()
@RequestMapping("/chat")
public class ChatBotController {

    @Autowired
    private ChatBotService chatBotService;

    @Autowired
    private UserService userService;

    @Autowired
    private WalletService walletService;

    @Autowired
    private OrderService orderService;

    @GetMapping("/coin/{coinName}")
    public ResponseEntity<CoinDTO> getCoinDetails(@PathVariable String coinName){

        CoinDTO coinDTO=chatBotService.getCoinByName(coinName);
        return new ResponseEntity<>(coinDTO, HttpStatus.OK);
    }

    @PostMapping("/bot")
    public ResponseEntity<Map<String, String>> simpleChat(
            @RequestHeader("Authorization") String jwt,
            @RequestBody PromptBody promptBody
    ) throws Exception {
        User user = userService.findUserProfileByJwt(jwt);
        Wallet wallet = walletService.getUserWallet(user);
        List<Order> orders = orderService.getAllOrdersForUser(user.getId(), null, null);
        
        // Get last 5 orders
        String recentOrders = orders.stream()
                .limit(5)
                .map(o -> o.getOrderType() + " " + o.getOrderItem().getQuantity() + " " + o.getOrderItem().getCoin().getSymbol())
                .collect(Collectors.joining(", "));

        String enrichedPrompt = String.format(
                "You are a crypto trading assistant for ZOS Trading. " +
                "User wallet balance: %s USDT. " +
                "Recent trades: %s. " +
                "Answer concisely and practically. User asks: %s",
                wallet.getBalance(),
                recentOrders.isEmpty() ? "No recent trades" : recentOrders,
                promptBody.getPrompt()
        );

        String res = chatBotService.simpleChat(enrichedPrompt);
        Map<String, String> response = new HashMap<>();
        response.put("message", res);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }


    @PostMapping("/bot/coin")
    public ResponseEntity<ApiResponse> getCoinRealtimeTime(@RequestBody PromptBody promptBody){

        ApiResponse res = chatBotService.getCoinDetails(promptBody.getPrompt());
        return new ResponseEntity<>(res, HttpStatus.OK);
    }
}
