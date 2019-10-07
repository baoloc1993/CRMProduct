package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

import static java.util.stream.Collectors.toList;
import static org.springframework.http.ResponseEntity.badRequest;
import static org.springframework.http.ResponseEntity.ok;

import com.example.demo.model.Role;
import com.example.demo.model.User;
import com.example.demo.repository.RoleRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.request.UserRequest;

@Controller
public class UserinfoController {
    @Autowired UserRepository userRepository;
    @Autowired RoleRepository roleRepository;

    @RequestMapping("/me")
    public ResponseEntity currentUser(@AuthenticationPrincipal UserDetails userDetails){
        Map<Object, Object> model = new HashMap<>();
        model.put("username", userDetails.getUsername());
        model.put("roles", userDetails.getAuthorities()
                .stream()
                .map(a -> ((GrantedAuthority) a).getAuthority())
                .collect(toList())
        );
        return ok(model);
    }

    @RequestMapping(value = "/changeRole", method = RequestMethod.POST)
    public ResponseEntity changeRole(Model model,  @RequestBody UserRequest userRequest){
        try{
            User user = userRepository.findById(userRequest.getUserId()).get();
            Role role = roleRepository.findById(userRequest.getRoleId()).get();
            user.setRole(role);
            userRepository.save(user);
            model.addAttribute("users",userRepository.findAll());
            model.addAttribute("roles", roleRepository.findAll());
        }catch (Exception e){
            e.printStackTrace();
            return badRequest().build();
        }
        return ok(model);
    }

    @RequestMapping(value = "/listUsers", method = RequestMethod.GET)
    public ResponseEntity changeRole(Model model){
        try{
            model.addAttribute("users",userRepository.findAll());
            model.addAttribute("roles", roleRepository.findAll());
        }catch (Exception e){
            e.printStackTrace();
            return badRequest().build();
        }
        return ok(model);
    }
}
