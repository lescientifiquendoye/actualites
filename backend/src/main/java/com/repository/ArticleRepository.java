package com.repository;

import com.model.Article;
import com.model.Categorie;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ArticleRepository extends JpaRepository<Article, Long> {
    List<Article> findByCategorie(Categorie categorie);

}
