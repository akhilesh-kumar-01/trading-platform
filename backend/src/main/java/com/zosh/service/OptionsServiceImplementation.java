package com.zosh.service;

import com.zosh.domain.OrderStatus;
import com.zosh.domain.OptionType;
import com.zosh.exception.WalletException;
import com.zosh.model.Coin;
import com.zosh.model.OptionOrder;
import com.zosh.model.User;
import com.zosh.model.Wallet;
import com.zosh.repository.OptionOrderRepository;
import com.zosh.repository.WalletRepository;
import com.zosh.response.OptionChainResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class OptionsServiceImplementation implements OptionsService {

    private final OptionOrderRepository optionOrderRepository;
    private final CoinService coinService;
    private final WalletService walletService;
    private final WalletRepository walletRepository;
    private final Random random = new Random();

    @Override
    public OptionChainResponse getOptionChain(String symbol) {
        OptionChainResponse response = new OptionChainResponse();
        response.setSymbol(symbol);

        // Generate mock expiries (next 3 Fridays)
        List<LocalDateTime> expiries = new ArrayList<>();
        LocalDateTime nextFriday = LocalDateTime.now()
                .with(TemporalAdjusters.next(DayOfWeek.FRIDAY))
                .truncatedTo(ChronoUnit.DAYS)
                .plusHours(16);
        expiries.add(nextFriday);
        expiries.add(nextFriday.plusWeeks(1));
        expiries.add(nextFriday.plusWeeks(4));
        response.setExpiries(expiries);

        try {
            Coin coin = coinService.findById(symbol.toLowerCase());
            double currentPrice = coin.getCurrentPrice();
            double strikeInterval = currentPrice > 1000 ? 500 : 10;
            double baseStrike = Math.round(currentPrice / strikeInterval) * strikeInterval;

            List<OptionChainResponse.OptionStrike> strikes = new ArrayList<>();
            for (int i = -10; i <= 10; i++) {
                double strikePrice = baseStrike + (i * strikeInterval);
                if (strikePrice > 0) {
                    strikes.add(generateMockStrike(BigDecimal.valueOf(strikePrice), currentPrice));
                }
            }
            response.setStrikes(strikes);
        } catch (Exception e) {
            response.setStrikes(new ArrayList<>());
        }

        return response;
    }

    private OptionChainResponse.OptionStrike generateMockStrike(BigDecimal strikePrice, double currentPrice) {
        OptionChainResponse.OptionStrike strike = new OptionChainResponse.OptionStrike();
        strike.setStrikePrice(strikePrice);

        double strikeVal = strikePrice.doubleValue();
        double dist = (currentPrice - strikeVal) / (currentPrice * 0.01); // percentage distance

        // Simplified premium calculation
        double callPremium = Math.max(10.0, (currentPrice - strikeVal) + (currentPrice * 0.04 * (1 + random.nextDouble())));
        double putPremium  = Math.max(10.0, (strikeVal - currentPrice) + (currentPrice * 0.04 * (1 + random.nextDouble())));

        double callDelta = Math.max(0.01, Math.min(0.99, 0.5 + dist / 200.0));
        double putDelta  = callDelta - 1.0;

        strike.setCall(new OptionChainResponse.OptionData(
                BigDecimal.valueOf(callPremium).setScale(2, RoundingMode.HALF_UP),
                (random.nextDouble() * 10) - 5,
                0.40 + random.nextDouble() * 0.20,
                callDelta,
                BigDecimal.valueOf(callPremium * 0.98).setScale(2, RoundingMode.HALF_UP),
                BigDecimal.valueOf(callPremium * 1.02).setScale(2, RoundingMode.HALF_UP)
        ));

        strike.setPut(new OptionChainResponse.OptionData(
                BigDecimal.valueOf(putPremium).setScale(2, RoundingMode.HALF_UP),
                (random.nextDouble() * 10) - 5,
                0.40 + random.nextDouble() * 0.20,
                putDelta,
                BigDecimal.valueOf(putPremium * 0.98).setScale(2, RoundingMode.HALF_UP),
                BigDecimal.valueOf(putPremium * 1.02).setScale(2, RoundingMode.HALF_UP)
        ));

        return strike;
    }

    @Override
    public OptionOrder placeOptionOrder(User user, OptionOrder orderRequest) throws Exception {
        Wallet wallet = walletService.getUserWallet(user);
        BigDecimal totalCost = orderRequest.getPremium()
                .multiply(BigDecimal.valueOf(orderRequest.getQuantity()));

        // Check the appropriate balance (demo or live)
        BigDecimal balance = user.isDemoAccount() ? wallet.getDemoBalance() : wallet.getBalance();
        if (balance.compareTo(totalCost) < 0) {
            throw new WalletException("Insufficient balance to pay the option premium. Required: " + totalCost);
        }

        // Deduct premium from the correct balance
        if (user.isDemoAccount()) {
            wallet.setDemoBalance(wallet.getDemoBalance().subtract(totalCost));
        } else {
            wallet.setBalance(wallet.getBalance().subtract(totalCost));
        }
        walletRepository.save(wallet);

        // Persist the order
        orderRequest.setUser(user);
        orderRequest.setTimestamp(LocalDateTime.now());
        orderRequest.setStatus(OrderStatus.SUCCESS);
        orderRequest.setDemoOrder(user.isDemoAccount());

        return optionOrderRepository.save(orderRequest);
    }

    @Override
    public List<OptionOrder> getUserOptionOrders(User user) {
        return optionOrderRepository.findByUserIdAndIsDemoOrder(user.getId(), user.isDemoAccount());
    }
}
