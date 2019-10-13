package com.example.demo.request;

import lombok.Data;

@Data
public class TransactionRequest {
    int userId;
    long paymentAmount;
}
