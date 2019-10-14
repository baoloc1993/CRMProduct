package com.example.demo.controller;

import static org.springframework.http.ResponseEntity.ok;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.Constant;
import com.example.demo.jwt.JwtTokenProvider;
import com.example.demo.model.OrderRecord;
import com.example.demo.model.OrderStatus;
import com.example.demo.model.User;
import com.example.demo.repository.OrderRepository;
import com.example.demo.repository.StatusRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.request.MigrateRequest;

@RestController
@RequestMapping("/data")
public class DataController {
  private static final int ORDER_LINK = 1;
  private static final int TRACK_LINK = 2;
  private static final int ADDRESS = 4;
  private static final int QUANTITY = 5;
  private static final int USD_PRICE = 6;
  private static final int TAX = 7;
  private static final int TOTAL_USD = 8;
  private static final int RATE = 9;
  private static final int TOTAL_VND = 10;
  @Autowired
  OrderRepository orderRepository;
  @Autowired
  UserRepository userRepository;
  @Autowired
  JwtTokenProvider jwtTokenProvider;
  @Autowired StatusRepository statusRepository;

  @RequestMapping(value = "/migrateData", method = RequestMethod.POST)
  public ResponseEntity handleOption(Model model, @RequestBody MigrateRequest migrateRequest,
      @RequestHeader("Authorization") String authorization) {
    String managerUsername = jwtTokenProvider.getUsername(authorization.substring(7));
    SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
    try {
      Date date = simpleDateFormat.parse(migrateRequest.getDate());

      LocalDateTime registerDateTime = LocalDate.from(date.toInstant().atZone(ZoneId.systemDefault())
          .toLocalDate()).atStartOfDay();
      int userId = migrateRequest.getUserId();
      String data = migrateRequest.getData();
      ArrayList<OrderRecord> orderRecords = new ArrayList<>();
      String[] lines = data.split("\\n");
      for (int i = 1; i <lines.length; i++) {
        String temp = lines[i];
        String[] columnValues = temp.split("\t");
        String orderLink = columnValues[ORDER_LINK];
        if (StringUtils.isEmpty(orderLink))
          continue;
        String trackLink = columnValues[TRACK_LINK];
        String address = columnValues[ADDRESS].replace("\"", "");
        String quantity = columnValues[QUANTITY];
        String usdPrice = columnValues[USD_PRICE];
        String tax = columnValues[TAX];
        if (StringUtils.isEmpty(tax))
          tax = "0";
        String totalUSD = columnValues[TOTAL_USD];
        String rate = columnValues[RATE];
        if (StringUtils.isEmpty(rate))
          rate = "0";
        String totalVND = columnValues[TOTAL_VND].replace(",", "");
        OrderRecord orderRecord = new OrderRecord();
        orderRecord.setAddress(address);
        User customer = userRepository.findById(userId).get();
        User manager = userRepository.findUserByUsername(managerUsername);

        orderRecord.setCustomer(customer);
        orderRecord.setPersonInCharge(manager);
        orderRecord.setManagerInCharge(manager);
        orderRecord.setPicDateTime(registerDateTime);
        orderRecord.setNote("Import from Google sheet");
        orderRecord.setOrderDateTime(registerDateTime);
        orderRecord.setCompletedDateTime(registerDateTime);
        orderRecord.setAssignDateTime(registerDateTime);
        orderRecord.setOrderLink(orderLink);
        orderRecord.setRate(Float.parseFloat(rate));
        orderRecord.setNumber(Integer.parseInt(quantity));
        orderRecord.setUsdPrice(Float.parseFloat(usdPrice));
        orderRecord.setTotalValueUsd(Float.parseFloat(totalUSD));
        orderRecord.setTotalValueVnd(Integer.parseInt(totalVND));
        OrderStatus orderStatus = statusRepository.findById(Constant.ORDERED).get();
        orderRecord.setStatus(orderStatus);
        orderRecord.setTrackingLink(trackLink);
        orderRecord.setTax(Float.parseFloat(tax));
        String param = trackLink.split("\\?")[1];
        Map<String, String> paramMap = new HashMap<>();
        String[] params = param.split("&");
        for (int j = 0; j < params.length; j++) {
          String p = params[j].split("=")[0];
          String v = params[j].split("=")[1];
          paramMap.put(p, v);
        }
        orderRecord.setOrderId(paramMap.get("orderId"));
        orderRecords.add(orderRecord);
      }
      orderRepository.saveAll(orderRecords);
    } catch (ParseException e) {
      e.printStackTrace();
    }

    System.out.println(migrateRequest.getData());
    return ok(model);
  }

  @RequestMapping(value = "/getCustomers", method = RequestMethod.GET)
  public ResponseEntity getCustomers(Model model) {
    List<User> customers = new ArrayList<>();
    userRepository.findAll().forEach(user -> {
      if (user.getRole().getId() == Constant.ROLE_CUSTOMER) {
        customers.add(user);
      }
    });
    model.addAttribute("customers", customers);
    return ok(model);
  }
}
