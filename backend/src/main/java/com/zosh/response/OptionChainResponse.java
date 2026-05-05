package com.zosh.response;

import com.zosh.domain.OptionType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class OptionChainResponse {
    private String symbol;
    private List<LocalDateTime> expiries;
    private List<OptionStrike> strikes;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class OptionStrike {
        private BigDecimal strikePrice;
        private OptionData call;
        private OptionData put;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class OptionData {
        private BigDecimal lastPrice;
        private double change;
        private double iv; // Implied Volatility
        private double delta;
        private BigDecimal bid;
        private BigDecimal ask;
    }
}
