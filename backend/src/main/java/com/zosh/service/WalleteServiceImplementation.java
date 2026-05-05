package com.zosh.service;


import com.zosh.domain.OrderType;
import com.zosh.domain.WalletTransactionType;
import com.zosh.exception.WalletException;
import com.zosh.model.*;

import com.zosh.repository.WalletRepository;
import com.zosh.repository.WalletTransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;

@Service

public class WalleteServiceImplementation implements WalletService {

    @Autowired
    private WalletRepository walletRepository;

    @Autowired
    private WalletTransactionRepository walletTransactionRepository;



    public Wallet genrateWallete(User user) {
        Wallet wallet=new Wallet();
        wallet.setUser(user);
        return walletRepository.save(wallet);
    }

    @Override
    public Wallet getUserWallet(User user) throws WalletException {

        Wallet wallet = walletRepository.findByUserId(user.getId());
        if (wallet != null) {
            return wallet;
        }

        wallet = genrateWallete(user);
        return wallet;
    }


    @Override
    public Wallet findWalletById(Long id) throws WalletException {
        Optional<Wallet> wallet=walletRepository.findById(id);
        if(wallet.isPresent()){
            return wallet.get();
        }
        throw new WalletException("Wallet not found with id "+id);
    }

    @Override
    public Wallet walletToWalletTransfer(User sender, Wallet receiverWallet, Long amount) throws WalletException {
        Wallet senderWallet = getUserWallet(sender);


        if (senderWallet.getBalance().compareTo(BigDecimal.valueOf(amount)) < 0) {
            throw new WalletException("Insufficient balance...");
        }

        BigDecimal senderBalance = senderWallet.getBalance().subtract(BigDecimal.valueOf(amount));
        senderWallet.setBalance(senderBalance);
        walletRepository.save(senderWallet);


        BigDecimal receiverBalance = receiverWallet.getBalance();
        receiverBalance = receiverBalance.add(BigDecimal.valueOf(amount));
        receiverWallet.setBalance(receiverBalance);
        walletRepository.save(receiverWallet);

        return senderWallet;
    }

    @Override
    public Wallet payOrderPayment(Order order, User user) throws WalletException {
        Wallet wallet = getUserWallet(user);

        WalletTransaction walletTransaction=new WalletTransaction();
        walletTransaction.setWallet(wallet);
        walletTransaction.setPurpose(order.getOrderType()+ " " + order.getOrderItem().getCoin().getId() );

        walletTransaction.setDate(LocalDate.now());
        walletTransaction.setTransferId(order.getOrderItem().getCoin().getSymbol());

        if (user.isDemoAccount()) {
            if (order.getOrderType().equals(OrderType.BUY)) {
                if (wallet.getDemoBalance().compareTo(order.getPrice()) < 0) {
                    throw new WalletException("Insufficient demo funds.");
                }
                wallet.setDemoBalance(wallet.getDemoBalance().subtract(order.getPrice()));
            } else if (order.getOrderType().equals(OrderType.SELL)) {
                wallet.setDemoBalance(wallet.getDemoBalance().add(order.getPrice()));
            }
        } else {
            if(order.getOrderType().equals(OrderType.BUY)){
                BigDecimal newBalance = wallet.getBalance().subtract(order.getPrice());
                if (newBalance.compareTo(BigDecimal.ZERO) < 0) {
                    throw new WalletException("Insufficient funds for this transaction.");
                }
                wallet.setBalance(newBalance);
            }
            else if(order.getOrderType().equals(OrderType.SELL)){
                BigDecimal newBalance = wallet.getBalance().add(order.getPrice());
                wallet.setBalance(newBalance);
            }
        }

        walletTransactionRepository.save(walletTransaction);
        walletRepository.save(wallet);
        return wallet;
    }

    @Override
    public Wallet addBalanceToWallet(Wallet wallet, Long money) throws WalletException {
        wallet.setBalance(wallet.getBalance().add(BigDecimal.valueOf(money)));
        
        WalletTransaction transaction = new WalletTransaction();
        transaction.setWallet(wallet);
        transaction.setAmount(money);
        transaction.setDate(LocalDate.now());
        transaction.setType(WalletTransactionType.DEPOSIT);
        transaction.setPurpose("Crypto Deposit");
        walletTransactionRepository.save(transaction);
        
        return walletRepository.save(wallet);
    }

    @Override
    public Wallet loadDemoBalance(User user) throws WalletException {
        Wallet wallet = getUserWallet(user);
        wallet.setDemoBalance(wallet.getDemoBalance().add(BigDecimal.valueOf(1000)));
        return walletRepository.save(wallet);
    }

}
