package com.example.demo.controller;

import com.example.demo.Constant;
import com.example.demo.jwt.JwtTokenProvider;
import com.example.demo.model.Role;
import com.example.demo.model.User;
import com.example.demo.repository.RoleRepository;
import com.example.demo.repository.TokenRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.request.AuthenticationRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import javax.sql.DataSource;

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
    UserRepository userRepository;
    @Autowired
    RoleRepository roleRepository;

    @Autowired
    TokenRepository tokenRepository;


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
            String token = jwtTokenProvider.createToken(username, this.userRepository.findUserByUsername(username).getRole());
//            TokenStatus tokenStatus =  new TokenStatus();
//            tokenStatus.setToken_str(token.substring(0, Constant.MAX_TOKEN_LENGTH));
//            tokenStatus.setPermit(1);
//            tokenRepository.save(tokenStatus);
            model.addAttribute("username", username);
            model.addAttribute("token", token);
            return ok(model);
        }catch (Exception e){
            e.printStackTrace();
            throw new BadCredentialsException("Invalid username/password supplied");
        }
    }

    @RequestMapping(value = "/logout" ,method = RequestMethod.POST)
    public ResponseEntity logout(Model model, @RequestHeader("Authorization") String authorization) {
        logger.info("logout");

//        try{
//            String tokenStr = authorization.substring(7);
//            TokenStatus tokenStatus = tokenRepository.findTokenByString(tokenStr.substring(0,Constant.MAX_TOKEN_LENGTH)).get();
//            tokenStatus.setPermit(0);
//            tokenRepository.save(tokenStatus);
//
//            return ok(model);
//        }catch (Exception e ){
//            return badRequest().build();
//        }
        return ok(model);

    }
    @RequestMapping(value = "/logout" ,method = RequestMethod.OPTIONS)
    public ResponseEntity logout(Model model) {

            return ok(model);

    }

    @RequestMapping(value = "/addUser" ,method = RequestMethod.POST)
    public ResponseEntity addUser(Model model, @RequestBody AuthenticationRequest authenticationRequest) {

        User user  = new User();
        user.setName(authenticationRequest.getName());
        user.setUsername(authenticationRequest.getUsername());
        user.setPassword(authenticationRequest.getPassword());
        Role role = roleRepository.findById(Constant.ROLE_CUSTOMER).get();
        user.setRole(role);
        userRepository.save(user);
        return ok().build();
    }

}