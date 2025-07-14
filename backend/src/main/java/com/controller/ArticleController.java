package com.controller;

import com.model.Article;
import com.model.Categorie;
import com.repository.ArticleRepository;
import com.repository.CategorieRepository;
import com.service.ArticleService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/articles")
public class ArticleController {

    private final ArticleRepository articleRepository;
    private final CategorieRepository categorieRepository;
    private final ArticleService articleService;

    public ArticleController(ArticleRepository articleRepository, CategorieRepository categorieRepository, ArticleService articleService) {
        this.articleRepository = articleRepository;
        this.categorieRepository = categorieRepository;
        this.articleService = articleService;
    }

    @GetMapping
    public List<Article> getAll() {
        return articleRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Article> getOne(@PathVariable Long id) { // CHANGEMENT: Retourne ResponseEntity pour une meilleure gestion des 404
        return articleRepository.findById(id)
                .map(article -> new ResponseEntity<>(article, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND)); // Retourne 404 si non trouvé
    }

    @GetMapping("/categorie/{nom}")
    public List<Article> getByCategorie(@PathVariable String nom) {
        return categorieRepository.findByNomIgnoreCase(nom)
                .map(articleRepository::findByCategorie) // Assurez-vous que findByCategorie est défini dans ArticleRepository pour prendre une Categorie
                .orElse(List.of());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Article> updateArticle(
            @PathVariable Long id,
            @RequestBody ArticleDto articleDto) {

        return articleService.updateArticle(id, articleDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> ajouterArticle(@RequestBody ArticleDto articleDto){ // CHANGEMENT: Renommé en ArticleDto pour plus de clarté
        Article article = articleDto.toArticle(); // CHANGEMENT: Utilisez une méthode de conversion plus complète
        Optional<Categorie> categorie = categorieRepository.findById(articleDto.getCategorieId());

        if (categorie.isEmpty()){
            // CHANGEMENT: HttpStatus.BAD_REQUEST (400) ou UNPROCESSABLE_ENTITY (422) est plus approprié
            // si l'ID de catégorie fourni par le client est introuvable.
            return new ResponseEntity<>("La catégorie avec l'ID " + articleDto.getCategorieId() + " n'existe pas.", HttpStatus.BAD_REQUEST);
        }

        article.setCategorie(categorie.get());

        // CHANGEMENT: HttpStatus.CREATED (201) pour une création réussie
        return new ResponseEntity<>(articleRepository.save(article), HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteArticle(@PathVariable Long id){
        if (!articleRepository.existsById(id)) {
            return new ResponseEntity<>("Article non trouvé avec l'ID: " + id, HttpStatus.NOT_FOUND);
        }
        articleRepository.deleteById(id);
        return new ResponseEntity<>("article supprimer",HttpStatus.NO_CONTENT); // 204 No Content pour une suppression réussie
    }

    public static class ArticleDto {
        private String titre;
        private String description;
        private String contenu;
        private LocalDate date; // CHANGEMENT: Assurez-vous que le format de date JSON est compatible (ex: "YYYY-MM-DD")
        private Long categorieId;

        // Constructeur par défaut (nécessaire pour Jackson)
        public ArticleDto() {
        }

        // Méthode pour convertir le DTO en entité Article
        public Article toArticle() {
            Article article = new Article();
            article.setTitre(this.titre);
            article.setDescription(this.description); // CORRECTION: Ajout de la description
            article.setContenu(this.contenu);
            article.setDate(this.date != null ? this.date : LocalDate.now()); // Définir la date actuelle si null
            // La catégorie sera définie par le contrôleur après avoir récupéré l'entité Categorie
            return article;
        }

        // Getters et Setters pour tous les champs (nécessaires pour Jackson)
        public String getTitre() { return titre; }
        public void setTitre(String titre) { this.titre = titre; }

        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }

        public String getContenu() { return contenu; }
        public void setContenu(String contenu) { this.contenu = contenu; }

        public LocalDate getDate() { return date; }
        public void setDate(LocalDate date) { this.date = date; }

        public Long getCategorieId() { return categorieId; }
        public void setCategorieId(Long categorieId) { this.categorieId = categorieId; }
    }
}