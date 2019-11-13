package com.example.demo.repository;

import com.example.demo.model.Transaction;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import java.time.LocalDateTime;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;

public interface TransactionRepository extends CrudRepository<Transaction, Integer> {
    @Query("FROM Transaction WHERE payDateTime BETWEEN  ?1 AND ?2")
    List<Optional<Transaction>> findListByDate(ZonedDateTime startDate, ZonedDateTime endDate);
}
