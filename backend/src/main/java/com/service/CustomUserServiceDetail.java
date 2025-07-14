package com.service;

import com.model.Utilisateur;
import com.repository.UtilisateurRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Optional;


@Service
public class CustomUserServiceDetail implements UserDetailsService {

    private final UtilisateurRepository utilisateurRepository;

    public CustomUserServiceDetail(UtilisateurRepository utilisateurRepository) {
        this.utilisateurRepository = utilisateurRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<Utilisateur> user = utilisateurRepository.findByLogin(username);

        if (user.isEmpty())
           throw  new UsernameNotFoundException("User not found with username: " + username);
        else
         return new org.springframework.security.core.userdetails.User(user.get().getLogin(), user.get().getMotDePasse(), new ArrayList<>());
    }
}