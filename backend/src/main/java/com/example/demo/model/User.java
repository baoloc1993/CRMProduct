package com.example.demo.model;

import com.example.demo.Constant;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@AllArgsConstructor
@Data
@NoArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    int id;

    String username;

    String password;
    String name;

    @ManyToOne
    @JoinColumn(name = "role_id", referencedColumnName = "id")
    Role role;

    public String getPassword(){
        return Constant.SALT_PREV + password + Constant.SALT_POST;
    }

}
