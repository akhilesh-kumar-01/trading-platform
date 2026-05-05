package com.zosh.service;


import com.zosh.model.Asset;
import com.zosh.model.Coin;
import com.zosh.model.User;
import com.zosh.repository.AssetsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AssetServiceImplementation implements  AssetService {
    private final AssetsRepository assetRepository;

    @Autowired
    public AssetServiceImplementation(AssetsRepository assetRepository) {
        this.assetRepository = assetRepository;
    }

    @Override
    public Asset createAsset(User user, Coin coin, double quantity, boolean isDemoAsset) {
        Asset asset = new Asset();

        asset.setQuantity(quantity);
        asset.setBuyPrice(coin.getCurrentPrice());
        asset.setCoin(coin);
        asset.setUser(user);
        asset.setDemoAsset(isDemoAsset);

        return assetRepository.save(asset);
    }


//    public Asset buyAsset(User user, Coin coin, Long quantity) {
//        return createAsset(user,coin,quantity);
//    }

    public Asset getAssetById(Long assetId) {
        return assetRepository.findById(assetId)
                .orElseThrow(() -> new IllegalArgumentException("Asset not found"));
    }

    @Override
    public Asset getAssetByUserAndId(Long userId, Long assetId) {
        return assetRepository.findByIdAndUserId(assetId,userId);
    }

    @Override
    public List<Asset> getUsersAssets(Long userId) {
        return assetRepository.findByUserId(userId);
    }

    @Override
    public List<Asset> getUsersAssets(Long userId, boolean isDemoAsset) {
        return assetRepository.findByUserIdAndIsDemoAsset(userId, isDemoAsset);
    }



    @Override
    public Asset updateAsset(Long assetId, double quantity) throws Exception {

        Asset oldAsset=getAssetById(assetId);
        if(oldAsset==null){
            throw new Exception("Asset not found...");
        }
        oldAsset.setQuantity(quantity+ oldAsset.getQuantity());

        return assetRepository.save(oldAsset);
    }

    @Override
    public Asset findAssetByUserIdAndCoinId(Long userId, String coinId) throws Exception {
        return assetRepository.findByUserIdAndCoinId(userId,coinId);
    }

    @Override
    public Asset findAssetByUserIdAndCoinId(Long userId, String coinId, boolean isDemoAsset) throws Exception {
        return assetRepository.findByUserIdAndCoinIdAndIsDemoAsset(userId,coinId, isDemoAsset);
    }


    public void deleteAsset(Long assetId) {
        assetRepository.deleteById(assetId);
    }

}
