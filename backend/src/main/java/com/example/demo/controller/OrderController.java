package com.example.demo.controller;

import com.example.demo.model.OrderRecord;
import com.example.demo.model.User;
import com.example.demo.repository.OrderRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.request.AssignOrderRequest;
import com.example.demo.request.CompleteOrderRequest;
import com.example.demo.request.OrderRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static org.springframework.http.ResponseEntity.badRequest;
import static org.springframework.http.ResponseEntity.ok;

@RestController
@CrossOrigin
@RequestMapping("/order")
public class OrderController {
    Logger logger = LoggerFactory.getLogger(OrderController.class);

    @Autowired
    OrderRepository orderRepository;

    @Autowired
    UserRepository userRepository;

    @RequestMapping(value = "/create" ,method = RequestMethod.POST)
    public ResponseEntity createOrder(Model model, @RequestBody OrderRequest orderRequest){
        try{
            OrderRecord orderRecord =  new OrderRecord();
            LocalDateTime registerDateTime =  LocalDateTime.now();
            User user = userRepository.findById(orderRequest.getUserId()).get();
            orderRecord.setAddress(orderRequest.getAddress());
            orderRecord.setCustomer(user);
            orderRecord.setNote(orderRequest.getNote());
            orderRecord.setOrderDateTime(registerDateTime);
            orderRecord.setOrderLink(orderRequest.getOrderLink());
            orderRecord.setRate(orderRequest.getRate());
            orderRecord.setAddress(orderRequest.getAddress());
            orderRecord.setUsdPrice(orderRequest.getUsdPrice());
            orderRecord.setRate(orderRequest.getRate());
            orderRecord.setTotalValueUsd(orderRequest.getTotalValueUsd());
            orderRecord.setTotalValueVnd(orderRequest.getTotalValueVnd());
            orderRecord.setStatus("NEW");
            orderRepository.save(orderRecord);
            return ok(model);
        }catch (Exception e) {
            logger.error(e.getMessage());
            return badRequest().build();
        }
    }

    @RequestMapping(value = "/assign" ,method = RequestMethod.POST)
    public ResponseEntity assignOrder(Model model, @RequestBody AssignOrderRequest assignOrderRequest){
        try{
            OrderRecord orderRecord = orderRepository.findById(assignOrderRequest.getOrderId()).get();
            LocalDateTime assignDateTime =  LocalDateTime.now();
            User staff = userRepository.findById(assignOrderRequest.getStaffId()).get();
            User manager = userRepository.findById(assignOrderRequest.getManagerId()).get();
            orderRecord.setId(assignOrderRequest.getOrderId());
            orderRecord.setAssignDateTime(assignDateTime);
            orderRecord.setManagerInCharge(manager);
            orderRecord.setPersonInCharge(staff);
            orderRecord.setStatus("IN PROGRESS");
            orderRepository.save(orderRecord);
            return ok(model);
        }catch (Exception e) {
            logger.error(e.getMessage());
            return badRequest().build();
        }
    }

    @RequestMapping(value = "/complete" ,method = RequestMethod.POST)
    public ResponseEntity completeOrder(Model model, @RequestBody CompleteOrderRequest completeOrderRequest){
        try{
            OrderRecord orderRecord = orderRepository.findById(completeOrderRequest.getOrderId()).get();
            User staff = userRepository.findById(completeOrderRequest.getStaffId()).get();
            orderRecord.setId(completeOrderRequest.getOrderId());
            orderRecord.setCompletedDateTime( LocalDateTime.now());
            orderRecord.setPersonInCharge(staff);
            orderRecord.setStatus("COMPLETED");
            orderRepository.save(orderRecord);
            return ok(model);
        }catch (Exception e) {
            logger.error(e.getMessage());
            return badRequest().build();
        }
    }


    @RequestMapping(value = "/get" ,method = RequestMethod.GET)
    public ResponseEntity getOrder(Model model, @RequestParam int orderId){
        try{
            OrderRecord orderRecord = orderRepository.findById(orderId).get();
            model.addAttribute("order",orderRecord);
            return ok(model);
        }catch (Exception e) {
            logger.error(e.getMessage());
            return badRequest().build();
        }
    }

    @RequestMapping(value = "/getListByPIC" ,method = RequestMethod.GET)
    public ResponseEntity getListOrderByPIC(Model model, @RequestParam int picId){
        try{
            List<Optional<OrderRecord>> listOrder = orderRepository.findListOrderByPIC(picId);
            model.addAttribute("order",listOrder.stream().map(Optional::get).collect(Collectors.toList()));
            return ok(model);
        }catch (Exception e) {
            logger.error(e.getMessage());
            return badRequest().build();
        }
    }

    @RequestMapping(value = "/getListByManager" ,method = RequestMethod.GET)
    public ResponseEntity getListOrderByManager(Model model, @RequestParam int managerId){
        try{
            List<Optional<OrderRecord>> listOrder = orderRepository.findListOrderByManager(managerId);
            model.addAttribute("order",listOrder.stream().map(Optional::get).collect(Collectors.toList()));
            return ok(model);
        }catch (Exception e) {
            logger.error(e.getMessage());
            return badRequest().build();
        }
    }
}
