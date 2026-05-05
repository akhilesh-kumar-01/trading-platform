import React, { useEffect, useRef, useState } from 'react';
import { 
  createChart, 
  CandlestickSeries, 
  HistogramSeries, 
  LineSeries, 
  AreaSeries, 
  CrosshairMode 
} from 'lightweight-charts';
import { 
  CandlestickChart, 
  TrendingUp, 
  AreaChart as AreaChartIcon, 
  Maximize2, 
  Loader2 
} from 'lucide-react';
import { useWebSocket } from '../hooks/useWebSocket';
import { Button } from './ui/button';

const TradingChart = ({ symbol, height = 480, showToolbar = true }) => {
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const candleSeriesRef = useRef(null);
  const volumeSeriesRef = useRef(null);
  const [chartType, setChartType] = useState('candle');
  const [isLoading, setIsLoading] = useState(true);
  const [ohlcvTooltip, setOhlcvTooltip] = useState(null);
  const { klineUpdate, selectedInterval, changeInterval } = useWebSocket();

  const intervalMap = {
    '1m': '1m', '5m': '5m', '15m': '15m',
    '1h': '1h', '4h': '4h', '1D': '1d', '1W': '1w'
  };

  const fetchHistoricalData = async (symbol, interval) => {
    setIsLoading(true);
    try {
      const bInterval = intervalMap[interval] || '1h';
      const url = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${bInterval}&limit=500`;
      const response = await fetch(url);
      const rawData = await response.json();

      const candles = rawData.map(k => ({
        time: Math.floor(k[0] / 1000),
        open: parseFloat(k[1]),
        high: parseFloat(k[2]),
        low: parseFloat(k[3]),
        close: parseFloat(k[4]),
      }));

      const volumes = rawData.map(k => ({
        time: Math.floor(k[0] / 1000),
        value: parseFloat(k[5]),
        color: parseFloat(k[4]) >= parseFloat(k[1]) ? 'rgba(0,192,118,0.4)' : 'rgba(255,59,92,0.4)',
      }));

      if (candleSeriesRef.current) candleSeriesRef.current.setData(candles);
      if (volumeSeriesRef.current) volumeSeriesRef.current.setData(volumes);
      if (chartRef.current) chartRef.current.timeScale().fitContent();
    } catch (error) {
      console.error('Error fetching historical data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const switchChartType = (newType) => {
    if (!chartRef.current) return;
    if (candleSeriesRef.current) {
      chartRef.current.removeSeries(candleSeriesRef.current);
    }

    let newSeries;
    const commonOptions = {
      priceLineVisible: true,
      lastValueVisible: true,
    };

    if (newType === 'candle') {
      newSeries = chartRef.current.addSeries(CandlestickSeries, {
        ...commonOptions,
        upColor: '#00C076',
        downColor: '#FF3B5C',
        borderUpColor: '#00C076',
        borderDownColor: '#FF3B5C',
        wickUpColor: '#00C076',
        wickDownColor: '#FF3B5C',
      });
    } else if (newType === 'line') {
      newSeries = chartRef.current.addSeries(LineSeries, {
        ...commonOptions,
        color: '#3D7EFF',
        lineWidth: 2,
      });
    } else if (newType === 'area') {
      newSeries = chartRef.current.addSeries(AreaSeries, {
        ...commonOptions,
        lineColor: '#3D7EFF',
        topColor: 'rgba(61,126,255,0.3)',
        bottomColor: 'rgba(61,126,255,0.0)',
        lineWidth: 2,
      });
    }

    candleSeriesRef.current = newSeries;
    setChartType(newType);
    fetchHistoricalData(symbol, selectedInterval);
  };

  useEffect(() => {
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: height,
      layout: {
        background: { color: '#111318' },
        textColor: '#6B7280',
        fontFamily: 'Inter, sans-serif',
        fontSize: 11,
      },
      grid: {
        vertLines: { color: '#1E2028', style: 1 },
        horzLines: { color: '#1E2028', style: 1 },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: { color: '#3D7EFF', labelBackgroundColor: '#3D7EFF' },
        horzLine: { color: '#3D7EFF', labelBackgroundColor: '#3D7EFF' },
      },
      rightPriceScale: {
        borderColor: '#1E2028',
        textColor: '#6B7280',
      },
      timeScale: {
        borderColor: '#1E2028',
        textColor: '#6B7280',
        timeVisible: true,
        secondsVisible: false,
        fixLeftEdge: true,
        fixRightEdge: true,
      },
      handleScroll: true,
      handleScale: true,
    });

    chartRef.current = chart;

    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#00C076',
      downColor: '#FF3B5C',
      borderUpColor: '#00C076',
      borderDownColor: '#FF3B5C',
      wickUpColor: '#00C076',
      wickDownColor: '#FF3B5C',
    });
    candleSeriesRef.current = candleSeries;

    const volumeSeries = chart.addSeries(HistogramSeries, {
      color: '#3D7EFF',
      priceFormat: { type: 'volume' },
      priceScaleId: 'volume',
    });
    chart.priceScale('volume').applyOptions({
      scaleMargins: { top: 0.82, bottom: 0 },
    });
    volumeSeriesRef.current = volumeSeries;

    chart.subscribeCrosshairMove((param) => {
      if (!param.time || !param.seriesData) {
        setOhlcvTooltip(null);
        return;
      }
      const candle = param.seriesData.get(candleSeriesRef.current);
      const vol = param.seriesData.get(volumeSeriesRef.current);
      if (candle) {
        setOhlcvTooltip({
          open: candle.open ?? candle.value,
          high: candle.high ?? candle.value,
          low: candle.low ?? candle.value,
          close: candle.close ?? candle.value,
          volume: vol?.value ?? 0,
          time: param.time,
        });
      }
    });

    const resizeObserver = new ResizeObserver(entries => {
      if (entries[0].contentRect.width && chartRef.current) {
        chartRef.current.applyOptions({ width: entries[0].contentRect.width });
      }
    });
    resizeObserver.observe(chartContainerRef.current);

    if (symbol && selectedInterval) {
      fetchHistoricalData(symbol, selectedInterval);
    }

    return () => {
      resizeObserver.disconnect();
      chart.remove();
    };
  }, [height]); // Re-run if height props changes

  useEffect(() => {
    if (symbol && selectedInterval) {
      fetchHistoricalData(symbol, selectedInterval);
    }
  }, [symbol, selectedInterval]);

  useEffect(() => {
    if (!klineUpdate || !candleSeriesRef.current) return;
    
    // Ensure the symbol matches
    // Note: klineUpdate comes from Binance which uses lowercase in stream names usually, 
    // but the data might not have symbol. We assume it's for the selected symbol.
    
    const candle = {
      time: Math.floor(klineUpdate.t / 1000),
      open: parseFloat(klineUpdate.o),
      high: parseFloat(klineUpdate.h),
      low: parseFloat(klineUpdate.l),
      close: parseFloat(klineUpdate.c),
    };
    
    if (chartType === 'candle') {
      candleSeriesRef.current.update(candle);
    } else {
      candleSeriesRef.current.update({ time: candle.time, value: candle.close });
    }

    if (volumeSeriesRef.current) {
      volumeSeriesRef.current.update({
        time: Math.floor(klineUpdate.t / 1000),
        value: parseFloat(klineUpdate.v),
        color: parseFloat(klineUpdate.c) >= parseFloat(klineUpdate.o) ? 'rgba(0,192,118,0.4)' : 'rgba(255,59,92,0.4)',
      });
    }
  }, [klineUpdate, chartType]);

  const formatVolume = (val) => {
    if (val >= 1000000) return (val / 1000000).toFixed(2) + 'M';
    if (val >= 1000) return (val / 1000).toFixed(2) + 'K';
    return val.toFixed(2);
  };

  return (
    <div className="flex flex-col w-full bg-bg-surface border border-border-dim rounded-lg overflow-hidden font-inter">
      {showToolbar && (
        <div className="flex items-center justify-between h-9 px-2 bg-bg-surface border-b border-border-dim">
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => switchChartType('candle')}
              className={`h-7 px-2 text-[11px] gap-1 ${chartType === 'candle' ? 'bg-accent text-white hover:bg-accent' : 'text-text-secondary hover:bg-bg-elevated'}`}
            >
              <CandlestickChart className="h-3 w-3" />
              <span className="hidden sm:inline">Candles</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => switchChartType('line')}
              className={`h-7 px-2 text-[11px] gap-1 ${chartType === 'line' ? 'bg-accent text-white hover:bg-accent' : 'text-text-secondary hover:bg-bg-elevated'}`}
            >
              <TrendingUp className="h-3 w-3" />
              <span className="hidden sm:inline">Line</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => switchChartType('area')}
              className={`h-7 px-2 text-[11px] gap-1 ${chartType === 'area' ? 'bg-accent text-white hover:bg-accent' : 'text-text-secondary hover:bg-bg-elevated'}`}
            >
              <AreaChartIcon className="h-3 w-3" />
              <span className="hidden sm:inline">Area</span>
            </Button>
          </div>

          <div className="flex items-center gap-1">
            {Object.keys(intervalMap).map((int) => (
              <Button
                key={int}
                variant="ghost"
                size="sm"
                onClick={() => changeInterval(int)}
                className={`h-7 px-2 text-[11px] ${selectedInterval === int ? 'bg-accent text-white hover:bg-accent' : 'text-text-secondary hover:bg-bg-elevated'}`}
              >
                {int}
              </Button>
            ))}
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 text-text-secondary hover:bg-bg-elevated"
            >
              <Maximize2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      )}

      <div className="relative flex-1 min-h-[300px]">
        {ohlcvTooltip && (
          <div className="absolute top-2 left-2 z-10 pointer-events-none text-[11px] font-mono flex flex-wrap gap-x-3 gap-y-1 bg-bg-elevated/80 backdrop-blur-sm px-2 py-1 rounded border border-border-dim shadow-xl">
            <span>O: <span className="text-text-primary">{ohlcvTooltip.open.toFixed(2)}</span></span>
            <span>H: <span className="text-buy">{ohlcvTooltip.high.toFixed(2)}</span></span>
            <span>L: <span className="text-sell">{ohlcvTooltip.low.toFixed(2)}</span></span>
            <span>C: <span className={ohlcvTooltip.close >= ohlcvTooltip.open ? 'text-buy' : 'text-sell'}>{ohlcvTooltip.close.toFixed(2)}</span></span>
            <span className="text-text-secondary">V: {formatVolume(ohlcvTooltip.volume)}</span>
          </div>
        )}

        {isLoading && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-bg-surface/90">
            <Loader2 className="h-8 w-8 text-accent animate-spin mb-2" />
            <span className="text-text-secondary text-sm">Loading chart data...</span>
          </div>
        )}

        <div ref={chartContainerRef} className="w-full h-full" />
      </div>
    </div>
  );
};

export default TradingChart;
