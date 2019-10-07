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
  int ROLE_MANAGER = 3;
  int ROLE_STAFF = 2;
  int ROLE_CUSTOMER = 4;

  /**
   * Order Status
   */
  int NEW = 0;
  int ASSIGNED = 1;
  int IN_PROGRESS = 2;
  int COMPLETE =3;


  int MAX_TOKEN_LENGTH = 100;
}
