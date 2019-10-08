package com.example.demo.model;

import java.time.LocalDateTime;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@AllArgsConstructor
@Data
@NoArgsConstructor
public class OrderRecord {

  @Id
  String id;

  String orderLink;
  String trackingLink;
  String address;
  float usdPrice;
  float tax;
  float totalValueUsd;
  float rate;
  float totalValueVnd;
  String note;
  int number;
  @ManyToOne
  @JoinColumn(name = "order_status", referencedColumnName = "id")
  OrderStatus status;
  /**
   * Date customer create order
   */
  LocalDateTime orderDateTime;
  /**
   * Date manager assign order
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