package com.example.demo;

public interface Constant {

  /**
   * Role
   */
  String STAFF = "STAFF";
  String ADMIN = "ADMIN";
  String MANAGER = "MANAGER";
  String CUSTOMER = "CUSTOMER";
  String GUEST = "GUEST";


  int ROLE_ADMIN = 1;
  int ROLE_MANAGER = 4;
  int ROLE_STAFF = 3;
  int ROLE_CUSTOMER = 2;

  /**
   * Order Status
   */
  int NEW = 0;
  int ASSIGNED = 1;
  int IN_PROGRESS = 2;
  int COMPLETE =3;

  int ORDERED = 1;
  int CANCELLED = 2;
  int RETURNED =3;


  int MAX_TOKEN_LENGTH = 100;

  String SALT_PREV = "zYBwYv92W46wmYPlEVMY";
  String SALT_POST = "OTYG3kBKJOU1FIYBjYoG";
}
