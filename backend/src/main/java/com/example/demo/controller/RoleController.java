package com.example.demo.controller;

import com.example.demo.jwt.JwtTokenProvider;
import com.example.demo.repository.RoleRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static org.springframework.http.ResponseEntity.ok;

@RestController
public class RoleController {

    @Autowired
    JwtTokenProvider jwtTokenProvider;

    @Autowired
    UserRepository userRepository;

    @Autowired RoleRepository roleRepository;

    @RequestMapping(value = "/getRole")
    public ResponseEntity getRole (Model model, @RequestHeader("Authorization") String authorization){
        String role;
        try{
            String userName = jwtTokenProvider.getUsername(authorization.substring(7));
            role= userRepository.findUserByUsername(userName).getRole().getName();
        }catch (Exception e){
            role = "GUEST";
        }
        model.addAttribute("role",role);
        return ok(model);

    }

    @RequestMapping(value = "/listRoles")
    public ResponseEntity listRoles (Model model){
        model.addAttribute("roles",roleRepository.findAll());
        return ok(model);

    }
}
