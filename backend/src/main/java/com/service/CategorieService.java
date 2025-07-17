package com.service;

import com.model.Article;
import com.model.Categorie;
import com.repository.ArticleRepository;
import com.repository.CategorieRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;

import java.util.List; // Importez List

@Service
public class CategorieService {

    private static final String DEFAULT_CATEGORY_NAME = "Non classé"; // Nom de la catégorie par défaut

    @Autowired
    private CategorieRepository categoryRepository;

    @Autowired
    private ArticleRepository articleRepository;

    /**
     * Trouve la catégorie par défaut. Si elle n'existe pas, la crée.
     * @return La catégorie par défaut.
     */
    @Transactional // Nécessaire si la création a lieu
    public Categorie findOrCreateDefaultCategory() {
        return categoryRepository.findByNomIgnoreCase(DEFAULT_CATEGORY_NAME)
                .orElseGet(() -> {
                    Categorie defaultCategory = new Categorie();
                    defaultCategory.setNom(DEFAULT_CATEGORY_NAME);
                    return categoryRepository.save(defaultCategory);
                });
    }

    @DeleteMapping // S'assure que l'opération est atomique
    public ResponseEntity<?> deleteCategory(Long id) throws Exception {
        Categorie categoryToDelete = categoryRepository.findById(id)
                .orElseThrow(() -> new Exception("Catégorie non trouvée avec l'ID: " + id));

        Categorie defaultCategory = findOrCreateDefaultCategory();

        if (categoryToDelete.getId().equals(defaultCategory.getId())) {
            throw new Exception("Impossible de supprimer la catégorie par défaut (" + DEFAULT_CATEGORY_NAME + ").");
        }

        categoryRepository.deleteById(id);

        return   ResponseEntity.ok(new String[]{"message", "Categorie bien supprimer !"});

//        List<Article> articlesToReassign = articleRepository.findByCategorie(categoryToDelete);
//        for (Article article : articlesToReassign) {
//            article.setCategorie(defaultCategory);
//        }
// articleRepository.saveAll(articlesToReassign);

      //  categoryRepository.delete(categoryToDelete);
    }

}