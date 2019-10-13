package com.example.demo.controller;

import com.example.demo.Constant;
import com.example.demo.model.OrderRecord;
import com.example.demo.model.Transaction;
import com.example.demo.model.User;
import com.example.demo.repository.OrderRepository;
import com.example.demo.repository.TransactionRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.request.TransactionRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.*;
import java.util.stream.Collectors;

import static org.springframework.http.ResponseEntity.badRequest;
import static org.springframework.http.ResponseEntity.ok;

@RestController
@CrossOrigin
@RequestMapping("/report")
public class ReportController {


    @Autowired
    OrderRepository orderRepository;

    @Autowired
    TransactionRepository transactionRepository;

    @Autowired
    UserRepository userRepository;

    @RequestMapping(value = "/getReport", method = RequestMethod.GET)
    public ResponseEntity createOrder(Model model, @RequestParam String dateStr) {
        try {
            Date date1 = new SimpleDateFormat("MM/dd/yyyy").parse(dateStr);

            LocalDateTime startDateTime = LocalDate.from(date1.toInstant().atZone(ZoneId.systemDefault())
                    .toLocalDate()).atStartOfDay();
            LocalDateTime endDateTime = LocalDate.from(date1.toInstant().atZone(ZoneId.systemDefault())
                    .toLocalDate().plusDays(1)).atStartOfDay();
            List<Optional<OrderRecord>> optionals = orderRepository.findListByDate(startDateTime, endDateTime);
            List<OrderRecord> orderRecords = optionals.stream().map(Optional::get).collect(Collectors.toList());
            List<Transaction> transactions = transactionRepository.findListByDate(startDateTime,endDateTime)
                    .stream().map(Optional::get).collect(Collectors.toList());

            HashMap<Integer, Long> moneyIn =  new HashMap<>();
            HashMap<Integer, Long> moneyOut =  new HashMap<>();
            orderRecords.forEach(record ->{
                int userId = record.getCustomer().getId();
                if (moneyOut.get(userId) != null){
                    long totalValueVnd = (long) record.getTotalValueVnd() + moneyOut.get(userId);
                    moneyOut.put(userId,totalValueVnd);
                }else{
                    moneyOut.put(userId, (long) record.getTotalValueVnd());
                }
            });

            transactions.forEach(transaction -> {
                int userId = transaction.getCustomer().getId();
                if (moneyIn.get(userId) != null){
                    long totalPayAmountVnd = (long) transaction.getPayAmountVnd() + moneyIn.get(userId);
                    moneyIn.put(userId,totalPayAmountVnd);
                }else{
                    moneyIn.put(userId, (long) transaction.getPayAmountVnd());
                }
            });
            model.addAttribute("transactions", transactions);
            model.addAttribute("moneyIn",moneyIn);
            model.addAttribute("moneyOut", moneyOut);
            return ok(model);

        } catch (ParseException e) {
            e.printStackTrace();
            return badRequest().build();
        }

    }

    @RequestMapping(value = "/getCustomers", method = RequestMethod.GET)
    public ResponseEntity getCustomers(Model model) {
        List<User> customers =  new ArrayList<>();
        userRepository.findAll().forEach(user -> {
            if (user.getRole().getId() == Constant.ROLE_CUSTOMER){
                customers.add(user);
            }
        });
        model.addAttribute("customers", customers);
        return ok(model);
    }

    @RequestMapping(value = "/makePayment", method = RequestMethod.POST)
    public ResponseEntity makePayment(Model model, @RequestBody TransactionRequest transactionRequest) {
        try{
            int userId = transactionRequest.getUserId();
            long paymentAmount =  transactionRequest.getPaymentAmount();
            Transaction transaction =  new Transaction();
            transaction.setCustomer(userRepository.findById(userId).get());
            transaction.setPayAmountVnd((float)paymentAmount);
            transaction.setPayDateTime(LocalDateTime.now());
            transactionRepository.save(transaction);
        }catch (Exception e){
            e.printStackTrace();
            return badRequest().build();
        }

        return ok().build();
    }
}
