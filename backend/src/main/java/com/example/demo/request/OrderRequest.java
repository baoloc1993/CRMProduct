package com.example.demo.request;

import lombok.Data;

@Data
public class OrderRequest {
    int id;
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
    int status;
}
