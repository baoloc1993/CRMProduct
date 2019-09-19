package com.example.demo.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import static org.springframework.http.ResponseEntity.ok;

@Controller
@RequestMapping("/auth")
public class AuthController {
    Logger logger = LoggerFactory.getLogger(LoginController.class);

    @RequestMapping(value = "/home")
    public ResponseEntity home(Model model) {
        return ok(model);
    }
    @RequestMapping(value = "/ship")
    public ResponseEntity ship(Model model) {
        return ok(model);
    }
    @RequestMapping(value = "/order")
    public ResponseEntity order(Model model) {
        return ok(model);
    }
}
