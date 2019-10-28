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

import lombok.AllArgsConstructor;
import lombok.Data;

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
    public ResponseEntity createOrder(Model model, @RequestParam String startDateStr, @RequestParam String endDateStr) {
        try {
            Date startDate = new SimpleDateFormat("MM/dd/yyyy").parse(startDateStr);
            Date endDate = new SimpleDateFormat("MM/dd/yyyy").parse(endDateStr);

            LocalDateTime startDateTime = LocalDate.from(startDate.toInstant().atZone(ZoneId.systemDefault())
                    .toLocalDate()).atStartOfDay();
            LocalDateTime endDateTime = LocalDate.from(endDate.toInstant().atZone(ZoneId.systemDefault())
                    .toLocalDate().plusDays(1)).atStartOfDay();
            List<Optional<OrderRecord>> optionals = orderRepository.findListByDate(startDateTime, endDateTime);
            List<OrderRecord> orderRecords = optionals.stream().map(Optional::get).collect(Collectors.toList());
            List<Transaction> transactions = transactionRepository.findListByDate(startDateTime,endDateTime)
                    .stream().map(Optional::get).collect(Collectors.toList());

            ArrayList<Money> moneyInResult =  new ArrayList<>();
            ArrayList<Money> moneyOutResult =  new ArrayList<>();
            ArrayList<Money> balanceResult =  new ArrayList<>();
            HashMap<Integer, Long> moneyIn =  new HashMap<>();
            HashMap<Integer, Long> moneyOut =  new HashMap<>();
            HashMap<Integer, Long> balance =  new HashMap<>();
            HashSet<Integer> listUser = new HashSet<>();
            orderRecords.forEach(record ->{
                int userId = record.getCustomer().getId();
                listUser.add(userId);
                if (moneyOut.get(userId) != null){
                    long totalValueVnd = (long) record.getTotalValueVnd() + moneyOut.get(userId);
                    moneyOut.put(userId,totalValueVnd);
                }else{
                    moneyOut.put(userId, (long) record.getTotalValueVnd());
                }
            });
            for (int i : moneyOut.keySet()){
                User user = userRepository.findById(i).get();
                moneyOutResult.add( new Money(i, user.getName(), moneyOut.get(i)));
            }

            transactions.forEach(transaction -> {
                int userId = transaction.getCustomer().getId();
                listUser.add(userId);
                if (moneyIn.get(userId) != null){
                    long totalPayAmountVnd = (long) transaction.getPayAmountVnd() + moneyIn.get(userId);
                    moneyIn.put(userId,totalPayAmountVnd);
                }else{
                    moneyIn.put(userId, (long) transaction.getPayAmountVnd());
                }
            });
            for (int i : moneyIn.keySet()){
                User user = userRepository.findById(i).get();
                moneyInResult.add( new Money(i, user.getName(), moneyIn.get(i)));
            }
            for (int i : listUser){
                User user = userRepository.findById(i).get();
                long moneyInL = moneyIn.containsKey(i) ? moneyIn.get(i) : 0;
                long moneyOutL = moneyOut.containsKey(i) ? moneyOut.get(i) : 0;
                balanceResult.add( new Money(i, user.getName(), moneyInL - moneyOutL));
            }
            model.addAttribute("transactions", transactions);
            model.addAttribute("moneyIn",moneyInResult);
            model.addAttribute("moneyOut", moneyOutResult);
            model.addAttribute("balances", balanceResult);
            return ok(model);

        } catch (ParseException e) {
            e.printStackTrace();
            return badRequest().build();
        }

    }
    @Data
    @AllArgsConstructor
    private class Money{
        int userId;
        String name;
        long paymentAmount;
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

