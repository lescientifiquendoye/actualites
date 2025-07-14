package com.repository;

import com.model.Categorie;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CategorieRepository extends JpaRepository<Categorie, Long> {
    Optional<Categorie> findById(Long id);
    Optional<Categorie> findByNomIgnoreCase(String nom);
    boolean existsByNom(String nom); // Nouvelle méthode pour vérifier l'existence par nom

}
