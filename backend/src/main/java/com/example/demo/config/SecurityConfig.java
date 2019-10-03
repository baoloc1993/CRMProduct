package com.example.demo.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.example.demo.Constant;
import com.example.demo.jwt.JwtSecurityConfigurer;
import com.example.demo.jwt.JwtTokenProvider;

@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {

  @Autowired
  JwtTokenProvider jwtTokenProvider;

  @Bean
  @Override
  public AuthenticationManager authenticationManagerBean() throws Exception {
    return super.authenticationManagerBean();
  }

  @Override
  protected void configure(HttpSecurity http) throws Exception {
    //@formatter:off
    http
        .httpBasic().disable()
        .csrf().disable()
        .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
        .and()
        .authorizeRequests()
        .antMatchers(HttpMethod.OPTIONS, "/auth/*").permitAll()
        .antMatchers("/login/process").permitAll()
        .antMatchers("/auth/*").hasAnyRole(Constant.ADMIN, Constant.STAFF, Constant.MANAGER)
        .antMatchers(HttpMethod.GET, "/getRole").permitAll()
        .antMatchers(HttpMethod.OPTIONS, "/getRole").permitAll()
        .antMatchers(HttpMethod.OPTIONS, "/order/*").permitAll()
        .antMatchers(HttpMethod.OPTIONS, "/login/logout").permitAll()
        .antMatchers(HttpMethod.POST, "/order/*").hasAnyRole(Constant.ADMIN, Constant.MANAGER, Constant.STAFF)
        .antMatchers(HttpMethod.GET, "/order/*").hasAnyRole(Constant.ADMIN, Constant.MANAGER, Constant.STAFF)
        .antMatchers(HttpMethod.POST, "/login/logout").hasAnyRole(Constant.ADMIN, Constant.MANAGER, Constant.STAFF)
        .antMatchers(HttpMethod.POST, "/order/create").permitAll()

        //                .antMatchers(HttpMethod.DELETE, "/vehicles/**").hasRole("ADMIN")
        //                .antMatchers(HttpMethod.GET, "/v1/vehicles/**").permitAll()
        .anyRequest().authenticated()
        .and()
        .apply(new JwtSecurityConfigurer(jwtTokenProvider));
    //@formatter:on
  }

  @Bean
  public PasswordEncoder passwordEncoder() {
    return new PasswordEncoder() {
      @Override
      public String encode(CharSequence charSequence) {
        return charSequence.toString();
      }

      @Override
      public boolean matches(CharSequence charSequence, String s) {
        return s.equals(charSequence.toString());
      }
    };
  }

}