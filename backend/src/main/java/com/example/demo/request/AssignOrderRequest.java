package com.example.demo.request;

import lombok.Data;

@Data
public class AssignOrderRequest {
    int orderId;
    int staffId;
    int managerId;

}
