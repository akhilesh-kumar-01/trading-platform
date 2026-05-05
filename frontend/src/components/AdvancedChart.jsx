import React, { useEffect, useRef, memo } from 'react';

const AdvancedChart = ({ symbol = "BTCUSDT", height = 480 }) => {
  const container = useRef();

  useEffect(() => {
    // Check if script is already loaded
    let script = document.getElementById('tradingview-widget-script');
    
    const initWidget = () => {
      if (typeof window.TradingView !== 'undefined' && container.current) {
        new window.TradingView.widget({
          "autosize": true,
          "height": height,
          "symbol": `BINANCE:${symbol.toUpperCase()}`,
          "interval": "15",
          "timezone": "Etc/UTC",
          "theme": "dark",
          "style": "1",
          "locale": "en",
          "toolbar_bg": "#111318",
          "enable_publishing": false,
          "hide_top_toolbar": false,
          "hide_legend": false,
          "save_image": true,
          "container_id": "tradingview_advanced",
          "backgroundColor": "#111318",
          "gridColor": "rgba(30, 32, 40, 1)",
          "withdateranges": true,
          "hide_side_toolbar": false,
          "allow_symbol_change": true,
          "details": true,
          "hotlist": false,
          "calendar": false,
          "show_popup_button": true,
          "popup_width": "1000",
          "popup_height": "650",
          "overrides": {
            "paneProperties.background": "#111318",
            "paneProperties.vertGridProperties.color": "#1E2028",
            "paneProperties.horzGridProperties.color": "#1E2028",
            "scalesProperties.textColor": "#9CA3AF",
            "scalesProperties.lineColor": "#1E2028",
            "mainSeriesProperties.candleStyle.upColor": "#00C076",
            "mainSeriesProperties.candleStyle.downColor": "#FF3B5C",
            "mainSeriesProperties.candleStyle.drawWick": true,
            "mainSeriesProperties.candleStyle.drawBorder": true,
            "mainSeriesProperties.candleStyle.borderUpColor": "#00C076",
            "mainSeriesProperties.candleStyle.borderDownColor": "#FF3B5C",
            "mainSeriesProperties.candleStyle.wickUpColor": "#00C076",
            "mainSeriesProperties.candleStyle.wickDownColor": "#FF3B5C"
          }
        });

      }
    };

    if (!script) {
      script = document.createElement("script");
      script.id = 'tradingview-widget-script';
      script.src = "https://s3.tradingview.com/tv.js";
      script.type = "text/javascript";
      script.async = true;
      script.onload = initWidget;
      document.head.appendChild(script);
    } else {
      initWidget();
    }

    return () => {
        // Cleanup if necessary
    };
  }, [symbol, height]);

  return (
    <div className='tradingview-widget-container border border-border-dim rounded-lg overflow-hidden h-full'>
      <div id='tradingview_advanced' ref={container} style={{ height: '100%' }} />
    </div>
  );
};

export default memo(AdvancedChart);
