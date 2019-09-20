package com.example.demo.repository;

import com.example.demo.model.TokenStatus;
import com.example.demo.model.User;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface TokenRepository extends CrudRepository<TokenStatus, String> {

    @Query("FROM TokenStatus WHERE token_str =?1 AND permit = 1")
    Optional<TokenStatus> findTokenByString(String token);

}
