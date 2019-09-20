package com.example.demo.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import com.example.demo.model.OrderRecord;
import com.example.demo.model.OrderStatus;

public interface StatusRepository extends CrudRepository<OrderStatus, Integer> {

}
