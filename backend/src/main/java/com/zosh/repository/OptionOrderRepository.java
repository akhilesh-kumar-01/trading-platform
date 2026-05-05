package com.zosh.repository;

import com.zosh.model.OptionOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OptionOrderRepository extends JpaRepository<OptionOrder, Long> {
    List<OptionOrder> findByUserId(Long userId);
    List<OptionOrder> findByUserIdAndIsDemoOrder(Long userId, boolean isDemoOrder);
}
