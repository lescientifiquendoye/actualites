package com.service;

import com.controller.ArticleController;
import com.model.Article;
import com.model.Categorie;
import com.repository.ArticleRepository;
import com.repository.CategorieRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ArticleService {

    private final ArticleRepository articleRepository;
    private final CategorieRepository categorieRepository;

    public ArticleService(ArticleRepository articleRepository, CategorieRepository categorieRepository) {
        this.articleRepository = articleRepository;
        this.categorieRepository = categorieRepository;
    }

    public Optional<Article> updateArticle(Long id, ArticleController.ArticleDto dto) {
        return articleRepository.findById(id).map(existingArticle -> {
            existingArticle.setTitre(dto.getTitre());
            existingArticle.setDescription(dto.getDescription());
            existingArticle.setContenu(dto.getContenu());
            existingArticle.setDate(dto.getDate());

            Categorie categorie = categorieRepository.findById(dto.getCategorieId())
                    .orElse(null);
            existingArticle.setCategorie(categorie);

            return articleRepository.save(existingArticle);
        });
    }
}
