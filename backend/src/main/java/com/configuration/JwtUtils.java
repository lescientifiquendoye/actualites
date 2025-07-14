package com.configuration;


import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.spec.SecretKeySpec;
import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Component
public class JwtUtils {
    @Value("${app.secret-key}")
    private String secretKey;

    @Value("${app.expiration-time}")
    private long expirationTime;

    private final Key key = Keys.secretKeyFor(SignatureAlgorithm.HS256);
    private final long jwtExpirationMs = expirationTime;

    public String generateToken(String username){
        Map<String, Object> claims =new HashMap<>();
        return  createToken(claims, username);
    }

    private String createToken(Map<String, Object> claims, String subject){
        return Jwts.builder().setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis()+expirationTime))
                .signWith(getSignKey(), SignatureAlgorithm.HS256) // 👈 utilise la même clé
                .compact();
    }

    private Key getSignKey(){
        byte[] keyBytes= secretKey.getBytes();
        return new SecretKeySpec(keyBytes,SignatureAlgorithm.HS256.getJcaName());
    }

    public  Boolean validateToken(String token, UserDetails userDetails){
        String username =extractUsename(token);
        return (username.equals(userDetails.getUsername())&&!isTokenExpired(token));
    }

    private boolean isTokenExpired(String token) {
        return extractExpirationDAte(token).before(new Date());
    }
    private Date extractExpirationDAte(String token){
        return  extractClaim(token,Claims::getExpiration);
    }

    public String extractUsename(String token){
        return extractClaim(token, Claims::getSubject);
    }
    private <T> T extractClaim(String token, Function<Claims,T> cleaimsResolver){
        final  Claims claims =extractAllClaims(token);
        return  cleaimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts
                .parserBuilder()
                .setSigningKey(getSignKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }


}
