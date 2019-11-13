package com.example.demo.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.time.ZonedDateTime;

@Entity
@AllArgsConstructor
@Data
@NoArgsConstructor
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    int id;

    ZonedDateTime payDateTime;

    float payAmountVnd;

    @ManyToOne
    @JoinColumn(name = "customer_id", referencedColumnName = "id")
    User customer;
}
