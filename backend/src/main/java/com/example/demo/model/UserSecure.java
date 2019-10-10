package com.example.demo.model;

import com.example.demo.Constant;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@AllArgsConstructor
@Data
@NoArgsConstructor
public class UserSecure {

    public UserSecure(User user){
        this.id = user.getId();
        this.password = user.getPassword().replace(Constant.SALT_PREV,"");
        this.password = this.password.replace(Constant.SALT_POST,"");
        this.username = user.getUsername();
        this.role = user.getRole();
        this.name = user.getName();
    }
    int id;

    String username;

    String password;
    String name;
    Role role;
}
