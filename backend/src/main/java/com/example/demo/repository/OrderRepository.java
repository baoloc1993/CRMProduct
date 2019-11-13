package com.example.demo.repository;

import java.time.LocalDateTime;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import com.example.demo.model.OrderRecord;

public interface OrderRepository extends CrudRepository<OrderRecord, Integer> {

    @Query("FROM OrderRecord WHERE pic_id =?1")
    List<Optional<OrderRecord>> findListOrderByPIC(int picID);

    @Query("FROM OrderRecord WHERE mic_id =?1")
    List<Optional<OrderRecord>> findListOrderByManager(int managerId);

    @Query("FROM OrderRecord WHERE customer_id =?1")
    List<Optional<OrderRecord>> findListOrderByCustomer(int customerId);

    @Query("FROM OrderRecord WHERE id =?1 AND (mic_id = ?2 OR pic_id = ?2)")
    Optional<OrderRecord> findById(int orderId, int userId);

    @Query("FROM OrderRecord WHERE  (mic_id = ?1 OR pic_id = ?1)")
    List<Optional<OrderRecord>> findList(int userId);

    @Query("FROM OrderRecord WHERE orderDateTime BETWEEN  ?1 AND ?2")
    List<Optional<OrderRecord>> findListByDate(ZonedDateTime startDate, ZonedDateTime endDate);
}
