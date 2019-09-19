package com.example.demo.repository;

import com.example.demo.model.OrderRecord;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.List;
import java.util.Optional;

public interface OrderRepository extends CrudRepository<OrderRecord, Integer> {

    @Query("FROM OrderRecord WHERE pic_id =?1")
    List<Optional<OrderRecord>> findListOrderByPIC (int picID);

    @Query("FROM OrderRecord WHERE mic_id =?1")
    List<Optional<OrderRecord>> findListOrderByManager (int managerId);
}
