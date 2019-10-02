package com.example.demo.controller;

import com.example.demo.data.ImportData;
import com.example.demo.repository.OrderRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.io.FileNotFoundException;
import java.io.PrintWriter;
import java.io.StringWriter;

import static org.springframework.http.ResponseEntity.badRequest;
import static org.springframework.http.ResponseEntity.ok;

@RestController
public class DataController {

    @Autowired
    OrderRepository orderRepository;
    @Autowired
    UserRepository userRepository;

    @RequestMapping(value = "/migrateData", method = RequestMethod.GET)
    public ResponseEntity handleOption(Model model, String dataUrl) {
        try {
            new ImportData().updateData(dataUrl,orderRepository,userRepository);
        } catch (FileNotFoundException e) {
            StringWriter sw = new StringWriter();
            e.printStackTrace(new PrintWriter(sw));
            String exceptionAsString = sw.toString();
            System.out.println(exceptionAsString);
            return ok(exceptionAsString);
        }
        return ok(model);
    }
}
