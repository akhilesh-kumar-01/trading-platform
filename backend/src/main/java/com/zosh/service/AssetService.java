package com.zosh.service;



import com.zosh.model.Asset;
import com.zosh.model.Coin;
import com.zosh.model.User;

import java.util.List;

public interface AssetService {
    Asset createAsset(User user, Coin coin, double quantity, boolean isDemoAsset);

    Asset getAssetById(Long assetId);

    Asset getAssetByUserAndId(Long userId,Long assetId);

    List<Asset> getUsersAssets(Long userId);
    List<Asset> getUsersAssets(Long userId, boolean isDemoAsset);

    Asset updateAsset(Long assetId,double quantity) throws Exception;

    Asset findAssetByUserIdAndCoinId(Long userId,String coinId) throws Exception;
    Asset findAssetByUserIdAndCoinId(Long userId,String coinId, boolean isDemoAsset) throws Exception;

    void deleteAsset(Long assetId);


}
