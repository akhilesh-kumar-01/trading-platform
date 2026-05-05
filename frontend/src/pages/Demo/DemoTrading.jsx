import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toggleDemoMode } from '@/Redux/Auth/Action';

import { RocketIcon, ShieldCheckIcon, WalletIcon, BarChart3Icon } from 'lucide-react';

const DemoTrading = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { auth } = useSelector(store => store);

    const handleStartDemo = () => {
        if (!auth.isDemoMode) {
            dispatch(toggleDemoMode(auth.jwt || localStorage.getItem("jwt")));
        }

        navigate('/demo');

    };

    return (
        <div className="min-h-[calc(100vh-48px)] bg-bg-base flex flex-col items-center justify-center p-4">
            <div className="max-w-4xl w-full text-center space-y-8">
                <div className="space-y-2">
                    <h1 className="text-4xl md:text-6xl font-bold text-text-primary tracking-tight">
                        Master the Markets with <span className="text-accent">Demo Trading</span>
                    </h1>
                    <p className="text-xl text-text-secondary max-w-2xl mx-auto">
                        Practice trading with zero risk. Get virtual funds and experience real-time market movements without spending a penny.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                    <Card className="bg-bg-surface border-border-dim hover:border-accent/50 transition-colors">
                        <CardHeader>
                            <WalletIcon className="w-10 h-10 text-accent mb-2" />
                            <CardTitle className="text-lg">Virtual Funds</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription className="text-text-secondary">
                                Start with 1,000 USDT virtual balance. Reload anytime if you run out.
                            </CardDescription>
                        </CardContent>
                    </Card>

                    <Card className="bg-bg-surface border-border-dim hover:border-accent/50 transition-colors">
                        <CardHeader>
                            <BarChart3Icon className="w-10 h-10 text-buy mb-2" />
                            <CardTitle className="text-lg">Real-Time Data</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription className="text-text-secondary">
                                Trade on live market data provided by major exchanges for a realistic experience.
                            </CardDescription>
                        </CardContent>
                    </Card>

                    <Card className="bg-bg-surface border-border-dim hover:border-accent/50 transition-colors">
                        <CardHeader>
                            <ShieldCheckIcon className="w-10 h-10 text-sell mb-2" />
                            <CardTitle className="text-lg">Zero Risk</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription className="text-text-secondary">
                                Perfect your strategies and learn how the platform works without any financial commitment.
                            </CardDescription>
                        </CardContent>
                    </Card>
                </div>

                <div className="pt-8">
                    <Button 
                        onClick={handleStartDemo}
                        size="lg" 
                        className="bg-accent hover:bg-accent/90 text-white px-10 py-6 text-lg font-bold rounded-full shadow-lg shadow-accent/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
                    >
                        <RocketIcon className="w-5 h-5" />
                        START DEMO TRADING NOW
                    </Button>
                </div>

                <p className="text-sm text-text-muted italic">
                    * Demo accounts are for educational purposes only. Profits made in demo mode cannot be withdrawn.
                </p>
            </div>
        </div>
    );
};

export default DemoTrading;
