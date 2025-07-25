package com.repository;

import com.model.Token;
import com.model.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TokenRepository extends JpaRepository<Token, Long> {
    Optional<Token> findByValeur(String valeur);
    void deleteByUtilisateur(Utilisateur utilisateur);
}
