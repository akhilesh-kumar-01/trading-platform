package com.zosh.controller;

import com.zosh.model.OptionOrder;
import com.zosh.model.User;
import com.zosh.response.OptionChainResponse;
import com.zosh.service.OptionsService;
import com.zosh.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/options")
@RequiredArgsConstructor
public class OptionsController {

    private final OptionsService optionsService;
    private final UserService userService;

    @GetMapping("/chain/{symbol}")
    public ResponseEntity<OptionChainResponse> getOptionChain(@PathVariable String symbol) {
        return ResponseEntity.ok(optionsService.getOptionChain(symbol));
    }

    @PostMapping("/order")
    public ResponseEntity<OptionOrder> placeOptionOrder(
            @RequestHeader("Authorization") String jwt,
            @RequestBody OptionOrder orderRequest) throws Exception {
        User user = userService.findUserProfileByJwt(jwt);
        return ResponseEntity.ok(optionsService.placeOptionOrder(user, orderRequest));
    }

    @GetMapping("/my-orders")
    public ResponseEntity<List<OptionOrder>> getMyOptionOrders(
            @RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserProfileByJwt(jwt);
        return ResponseEntity.ok(optionsService.getUserOptionOrders(user));
    }
}
