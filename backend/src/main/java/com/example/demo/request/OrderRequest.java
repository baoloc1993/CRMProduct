package com.example.demo.request;

import lombok.Data;

@Data
public class OrderRequest {
    String orderId;
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
    String customerName;
}
