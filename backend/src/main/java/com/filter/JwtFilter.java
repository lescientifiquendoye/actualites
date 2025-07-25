package com.filter;

import com.configuration.JwtUtils;
import com.service.CustomUserServiceDetail;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public  class JwtFilter extends OncePerRequestFilter {

    private  final CustomUserServiceDetail customUserServiceDetail;
    private  final JwtUtils jwtUtils;

    public JwtFilter(CustomUserServiceDetail customUserServiceDetail, JwtUtils jwtUtils) {
        this.customUserServiceDetail = customUserServiceDetail;

        this.jwtUtils=jwtUtils;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        final  String authHeader= request.getHeader("Authorization");

        String username=null;
        String jwt = null;

        if(authHeader!= null && authHeader.startsWith("Bearer ")){
            jwt=authHeader.substring(7);
            username=jwtUtils.extractUsename(jwt);
        }
        if (username != null&& SecurityContextHolder.getContext().getAuthentication()==null){
            UserDetails userDetails=customUserServiceDetail.loadUserByUsername(username);
            if (jwtUtils.validateToken(jwt,userDetails)){
                UsernamePasswordAuthenticationToken authenticationToken= new UsernamePasswordAuthenticationToken(userDetails,null,userDetails.getAuthorities());
                authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authenticationToken);
            }
        }
        filterChain.doFilter(request ,response);
    }

}
