package com.example.demo.controller;

import static org.springframework.http.ResponseEntity.badRequest;
import static org.springframework.http.ResponseEntity.ok;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.Constant;
import com.example.demo.jwt.JwtTokenProvider;
import com.example.demo.model.OrderRecord;
import com.example.demo.model.OrderStatus;
import com.example.demo.model.User;
import com.example.demo.repository.OrderRepository;
import com.example.demo.repository.StatusRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.request.AssignOrderRequest;
import com.example.demo.request.CompleteOrderRequest;
import com.example.demo.request.OrderRequest;

@RestController
@CrossOrigin
@RequestMapping("/order")
public class OrderController {
  Logger logger = LoggerFactory.getLogger(OrderController.class);

  @Autowired
  OrderRepository orderRepository;

  @Autowired
  UserRepository userRepository;

  @Autowired
  JwtTokenProvider jwtTokenProvider;

  @Autowired
  StatusRepository statusRepository;

  @RequestMapping(value = "/*",method = RequestMethod.OPTIONS)
  public ResponseEntity handleOption(Model model){
    return ok(model);
  }
  @RequestMapping(value = "/update", method = RequestMethod.POST)
  public ResponseEntity updateOrder(Model model, @RequestBody OrderRequest orderRequest,
      @RequestHeader("Authorization") String authorization) {
    try {
      if (StringUtils.isEmpty(orderRequest.getOrderLink())
          || StringUtils.isEmpty(orderRequest.getAddress())
          || orderRequest.getUsdPrice() <= 0) {
        return badRequest().build();
      }
      OrderRecord orderRecord = new OrderRecord();
      orderRecord.setId(orderRequest.getOrderId());
      addOrder(orderRequest, orderRecord, authorization);
      return ok().build();
    } catch (Exception e) {
      logger.error(e.getMessage());
      e.printStackTrace();
      return badRequest().build();
    }
  }

  private void addOrder(@RequestBody OrderRequest orderRequest,
      OrderRecord orderRecord, String authorization) {
    String userName = jwtTokenProvider.getUsername(authorization.substring(7));
    LocalDateTime registerDateTime = LocalDateTime.now();
    User user = userRepository.findUserByUsername(userName);
    orderRecord.setAddress(orderRequest.getAddress());
    orderRecord.setCustomer(user);
    orderRecord.setNote(orderRequest.getNote());
    orderRecord.setOrderDateTime(registerDateTime);
    orderRecord.setOrderLink(orderRequest.getOrderLink());
    orderRecord.setRate(orderRequest.getRate());
    orderRecord.setNumber(orderRequest.getNumber());
    orderRecord.setUsdPrice(orderRequest.getUsdPrice());
    orderRecord.setRate(orderRequest.getRate());
    float totalValueUsd = orderRequest.getUsdPrice() * (1 + orderRequest.getTax());
    orderRecord.setTotalValueUsd(totalValueUsd);
    orderRecord.setTotalValueVnd(totalValueUsd * orderRequest.getRate());
    OrderStatus orderStatus = statusRepository.findById(Constant.NEW).get();
    orderRecord.setStatus(orderStatus);
    orderRepository.save(orderRecord);
  }

  @RequestMapping(value = "/create", method = RequestMethod.POST)
  public ResponseEntity createOrder(Model model, @RequestBody OrderRequest orderRequest,
                                    @RequestHeader("Authorization") String authorization) {
    try {
      if (StringUtils.isEmpty(orderRequest.getOrderLink())
              || StringUtils.isEmpty(orderRequest.getAddress())
              || orderRequest.getUsdPrice() <= 0) {
        return badRequest().build();
      }
      OrderRecord orderRecord = new OrderRecord();
      addOrder(orderRequest, orderRecord, authorization);
      return ok().build();
    } catch (Exception e) {
      logger.error(e.getMessage());
      e.printStackTrace();
      return badRequest().build();
    }
  }

  @RequestMapping(value = "/assign", method = RequestMethod.POST)
  public ResponseEntity assignOrder(Model model, @RequestBody AssignOrderRequest assignOrderRequest,
      @RequestHeader("Authorization") String authorization) {
    try {
      String userName = jwtTokenProvider.getUsername(authorization.substring(7));
      User user = userRepository.findUserByUsername(userName);

      OrderRecord orderRecord = orderRepository.findById(assignOrderRequest.getOrderId()).get();
      LocalDateTime assignDateTime = LocalDateTime.now();
      User staff = userRepository.findById(assignOrderRequest.getStaffId()).get();
      User manager = userRepository.findById(user.getId()).get();
      orderRecord.setId(assignOrderRequest.getOrderId());
      orderRecord.setAssignDateTime(assignDateTime);
      orderRecord.setManagerInCharge(manager);
      orderRecord.setPersonInCharge(staff);
      OrderStatus orderStatus =  statusRepository.findById(Constant.ASSIGNED).get();
      orderRecord.setStatus(orderStatus);
      orderRepository.save(orderRecord);
      return ok(model);
    } catch (Exception e) {
      logger.error(e.getMessage());
      return badRequest().build();
    }
  }

  @RequestMapping(value = "/complete", method = RequestMethod.POST)
  public ResponseEntity completeOrder(Model model, @RequestBody CompleteOrderRequest completeOrderRequest) {
    try {
      int orderId = completeOrderRequest.getOrderId();
      OrderRecord orderRecord = orderRepository.findById(orderId).get();
      orderRecord.setId(orderId);
      orderRecord.setCompletedDateTime(LocalDateTime.now());
      OrderStatus orderStatus =  statusRepository.findById(Constant.COMPLETE).get();
      orderRecord.setStatus(orderStatus);
      orderRepository.save(orderRecord);
      return ok(model);
    } catch (Exception e) {
      logger.error(e.getMessage());
      return badRequest().build();
    }
  }

  @RequestMapping(value = "/perform", method = RequestMethod.POST)
  public ResponseEntity performOrder(Model model, @RequestBody CompleteOrderRequest completeOrderRequest) {
    try {
      int orderId = completeOrderRequest.getOrderId();
      OrderRecord orderRecord = orderRepository.findById(orderId).get();
      orderRecord.setPicDateTime(LocalDateTime.now());
      OrderStatus orderStatus =  statusRepository.findById(Constant.IN_PROGRESS).get();
      orderRecord.setStatus(orderStatus);
      orderRepository.save(orderRecord);
      return ok(model);
    } catch (Exception e) {
      logger.error(e.getMessage());
      return badRequest().build();
    }
  }

  @RequestMapping(value = "/get", method = RequestMethod.GET)
  public ResponseEntity getOrder(Model model, @RequestParam String orderId,
      @RequestHeader("Authorization") String authorization) {
    try {
      String userName = jwtTokenProvider.getUsername(authorization.substring(7));
      User user = userRepository.findUserByUsername(userName);
      OrderRecord orderRecord;
      if (user.getRole().getName().equals("ADMIN")) {
        orderRecord = orderRepository.findById(Integer.parseInt(orderId)).get();
      } else {
        orderRecord = orderRepository.findById(Integer.parseInt(orderId), user.getId()).get();
      }
      model.addAttribute("order", orderRecord);
      model.addAttribute("role", user.getRole().getName());
      return ok(model);
    } catch (Exception e) {
      logger.error(e.getMessage());
      return badRequest().build();
    }
  }

  @RequestMapping(value = "/getListByPIC", method = RequestMethod.GET)
  public ResponseEntity getListOrderByPIC(Model model, @RequestParam int picId) {
    try {
      List<Optional<OrderRecord>> listOrder = orderRepository.findListOrderByPIC(picId);
      model.addAttribute("order", listOrder.stream().map(Optional::get).collect(Collectors.toList()));
      return ok(model);
    } catch (Exception e) {
      logger.error(e.getMessage());
      return badRequest().build();
    }
  }

  @RequestMapping(value = "/getListByCustomer", method = RequestMethod.GET)
  public ResponseEntity getListOrderByCustomer(Model model, @RequestParam int customerId) {
    try {
      List<Optional<OrderRecord>> listOrder = orderRepository.findListOrderByCustomer(customerId);
      model.addAttribute("order", listOrder.stream().map(Optional::get).collect(Collectors.toList()));
      return ok(model);
    } catch (Exception e) {
      logger.error(e.getMessage());
      return badRequest().build();
    }
  }

  @RequestMapping(value = "/getListByManager", method = RequestMethod.GET)
  public ResponseEntity getListOrderByManager(Model model, @RequestParam int managerId) {
    try {
      List<Optional<OrderRecord>> listOrder = orderRepository.findListOrderByManager(managerId);
      model.addAttribute("order", listOrder.stream().map(Optional::get).collect(Collectors.toList()));
      return ok(model);
    } catch (Exception e) {
      logger.error(e.getMessage());
      return badRequest().build();
    }
  }

  @RequestMapping(value = "/getList", method = RequestMethod.GET)
  public ResponseEntity getListOrder(Model model, @RequestHeader("Authorization") String authorization) {
    try {
      String userName = jwtTokenProvider.getUsername(authorization.substring(7));
      User user = userRepository.findUserByUsername(userName);
      List<User> staffs = new ArrayList<>();
      userRepository.findAll().forEach(staff -> {
        if (staff.getRole().getName().equals(Constant.STAFF)) {
          staffs.add(staff);
        }
      });
      List<OrderRecord> listOrder = new ArrayList<>();
      if (user.getRole().getName().equals(Constant.ADMIN)) {
        List<OrderRecord> finalListOrder = listOrder;
        orderRepository.findAll().forEach(order -> finalListOrder.add(order));
      } else {
        listOrder = orderRepository.findList(user.getId()).stream().map(Optional::get).collect(Collectors.toList());
      }

      model.addAttribute("order", listOrder);
      model.addAttribute("staff", staffs);
      return ok(model);
    } catch (Exception e) {
      logger.error(e.getMessage());
      return ok(model);
    }
  }
}
