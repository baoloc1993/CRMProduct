package com.example.demo.model;

import com.example.demo.model.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;

@Entity
@AllArgsConstructor
@Data
@NoArgsConstructor
public class OrderRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    int id;

    String orderLink;
    String trackingLink;
    String address;
    float usdPrice;
    float tax;
    float totalValueUsd;
    float rate;
    float totalValueVnd;
    String note;
    String status;
    /**
    Date customer create order
     */
    LocalDateTime orderDateTime;
    /**
     Date manager assign order
     */
    LocalDateTime assignDateTime;
    /**
     * Date PIC take the order
     */
    LocalDateTime picDateTime;

    /**
     * Date order finish
     */
    LocalDateTime completedDateTime;

    @ManyToOne
    @JoinColumn(name = "customer_id", referencedColumnName = "id")
    User customer;

    @ManyToOne
    @JoinColumn(name = "pic_id", referencedColumnName = "id")
    User personInCharge;

    @ManyToOne
    @JoinColumn(name = "mic_id", referencedColumnName = "id")
    User managerInCharge;




}