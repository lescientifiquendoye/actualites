package com.configuration;

import com.filter.JwtFilter;
import com.service.CustomUserServiceDetail;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final CustomUserServiceDetail customUserServiceDetail;
    private  final  JwtUtils jwtUtils;

    public SecurityConfig(CustomUserServiceDetail customUserServiceDetail, JwtUtils jwtUtils) {
        this.customUserServiceDetail = customUserServiceDetail;
        this.jwtUtils = jwtUtils;
    }

    @Bean
    public PasswordEncoder passwordEncoder(){
        return  new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(HttpSecurity http,PasswordEncoder passwordEncoder) throws Exception{
        AuthenticationManagerBuilder authenticationManagerBuilder =http.getSharedObject(AuthenticationManagerBuilder.class);
        authenticationManagerBuilder.userDetailsService(customUserServiceDetail).passwordEncoder(passwordEncoder);
        return  authenticationManagerBuilder.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:19006","http://localhost:4200")); // ou "*"
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true); // si tu utilises des cookies/JWT dans les headers

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .cors(withDefaults())
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                        // Routes publiques
                        .requestMatchers(
                                "/api/auth/**",
                                "/api/articles/public/**",
                                "/error",
                                "/swagger-ui/**",
                                "/v3/api-docs/**",
                                "/swagger-ui.html",
                                "/api/categories",
                                "/api/categories/**",
                                "/api/articles/**",
                                "/api/articles"
                        ).permitAll()

                        // Routes protégées par rôle
                        .requestMatchers("/api/articles/**", "/api/categories/**","/api/categories/*").hasAnyRole("EDITEUR", "ADMIN")
                        .requestMatchers("/api/utilisateur/**","/api/utilisateur", "/api/token/**").hasRole("ADMIN")

                        // Toutes les autres requêtes nécessitent une authentification
                        .anyRequest().authenticated()
                )
                .addFilterBefore(new JwtFilter(customUserServiceDetail, jwtUtils), UsernamePasswordAuthenticationFilter.class)
                .build();

//                http.cors(withDefaults()).csrf(AbstractHttpConfigurer::disable)
//                .authorizeHttpRequests(auth ->
//                        auth.anyRequest().permitAll() )//requestMatchers("/api/*/*","/api/*","/api/auth/*","/api/profs/resourcesf","/error","/swagger-ui/*", "/v3/api-docs/**").permitAll().anyRequest().authenticated())
//                .addFilterBefore(new JwtFilter(customUserServiceDetail,jwtUtils), UsernamePasswordAuthenticationFilter.class)
//                .build();

    }
}
