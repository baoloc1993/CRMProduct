package com.example.demo.request;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class MigrateRequest {
  int userId;
  String date;
  String data;
}
