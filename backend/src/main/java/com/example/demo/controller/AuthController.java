package com.example.demo.controller;

import com.example.demo.jwt.JwtTokenProvider;
import com.example.demo.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import static org.springframework.http.ResponseEntity.ok;

@RestController
@RequestMapping("/auth")
public class AuthController {
    Logger logger = LoggerFactory.getLogger(LoginController.class);

    @Autowired
    JwtTokenProvider jwtTokenProvider;
    @Autowired
    UserRepository userRepository;

    @RequestMapping(value = "/home")
    public ResponseEntity home(Model model) {
        return ok(model);
    }
    @RequestMapping(value = "/ship")
    public ResponseEntity ship(Model model) {
        return ok(model);
    }


}
