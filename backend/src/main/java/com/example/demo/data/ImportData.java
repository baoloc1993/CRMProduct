package com.example.demo.data;

import com.example.demo.Constant;
import com.example.demo.model.OrderRecord;
import com.example.demo.model.OrderStatus;
import com.example.demo.model.User;
import com.example.demo.repository.OrderRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.util.StringUtils;

import java.io.File;
import java.io.FileNotFoundException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Scanner;

public class ImportData {
    private static final int ORDER_LINK = 1;
    private static final int TRACK_LINK = 2;
    private static final int ADDRESS = 4;
    private static final int QUANTITY = 5;
    private static final int USD_PRICE = 6;
    private static final int TAX = 7;
    private static final int TOTAL_USD = 8;
    private static final int RATE = 9;
    private static final int TOTAL_VND = 10;



    public void updateData (String dataUrl,OrderRepository orderRepository, UserRepository userRepository) throws FileNotFoundException {
        File file;
        if (!StringUtils.isEmpty(dataUrl)){
            file =  new File (dataUrl);
        }else {
            file = new File(new File("").getAbsolutePath() + "/data.csv");
        }
        Scanner scanner = new Scanner (file);

        ArrayList<OrderRecord> orderRecords =  new ArrayList<>();
        while (scanner.hasNextLine()){
            String temp =  scanner.nextLine();
            String[] data = temp.split("\t");
            String orderLink = data[ORDER_LINK];
            if (StringUtils.isEmpty(orderLink)) continue;
            String trackLink = data[TRACK_LINK];
            String address = data[ADDRESS].replace("\"","");
            String quantity = data[QUANTITY];
            String usdPrice = data[USD_PRICE];
            String tax = data[TAX];
            if (StringUtils.isEmpty(tax)) tax = "0";
            String totalUSD = data[TOTAL_USD];
            String rate = data[RATE];
            if (StringUtils.isEmpty(rate)) rate = "0";
            String totalVND = data[TOTAL_VND].replace(",","");
            OrderRecord orderRecord = new OrderRecord();
            LocalDateTime registerDateTime = LocalDateTime.now();
            orderRecord.setAddress(address);
            User bot =  userRepository.findUserByUsername("bot");

            orderRecord.setCustomer(bot);
            orderRecord.setPersonInCharge(bot);
            orderRecord.setManagerInCharge(bot);
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
            OrderStatus orderStatus = new OrderStatus();
            orderStatus.setId(Constant.COMPLETE);
            orderRecord.setStatus(orderStatus);
            orderRecord.setTrackingLink(trackLink);
            orderRecord.setTax(Float.parseFloat(tax));
            orderRecords.add(orderRecord);
        }
        orderRepository.saveAll(orderRecords);
    }
}

