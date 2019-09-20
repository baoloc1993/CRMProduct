package com.example.demo.controller;

import com.example.demo.PdfUserDetails;
import com.example.demo.jwt.JwtTokenProvider;
import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpSession;
import javax.sql.DataSource;

import java.time.LocalDate;
import java.util.Calendar;
import java.util.Date;

import static org.springframework.http.ResponseEntity.*;


@RestController
@CrossOrigin
@RequestMapping("/login")
public class LoginController {
    @Autowired
    DataSource dataSource;
    @Autowired
    AuthenticationManager authenticationManager;
    @Autowired
    JwtTokenProvider jwtTokenProvider;
    @Autowired
    UserRepository users;


    Logger logger = LoggerFactory.getLogger(LoginController.class);

    @RequestMapping(value = "/process" ,method = RequestMethod.OPTIONS)
    public ResponseEntity loginProcess(Model model) {
        return ok(model);
    }

    @RequestMapping(value = "/process" ,method = RequestMethod.POST)
    public ResponseEntity login(Model model, @RequestParam String username, @RequestParam String password) {
        logger.info("login()");

        // read principal out of security context and set it to session
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
            String token = jwtTokenProvider.createToken(username, this.users.findUserByUsername(username).getRole());
            model.addAttribute("username", username);
            model.addAttribute("token", token);
            return ok(model);
        }catch (Exception e){
            throw new BadCredentialsException("Invalid username/password supplied");
        }
    }
    private void validatePrinciple(Object principal) {
        if (!(principal instanceof PdfUserDetails)) {
            throw new  IllegalArgumentException("Principal can not be null!");
        }
    }
}