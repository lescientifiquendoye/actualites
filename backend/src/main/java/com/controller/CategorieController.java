package com.controller;

import com.model.Categorie;
import com.repository.CategorieRepository;
import org.hibernate.annotations.NotFound;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/categories")
public class CategorieController {

    private final CategorieRepository categorieRepository;

    public CategorieController(CategorieRepository categorieRepository) {
        this.categorieRepository = categorieRepository;
    }

    @GetMapping
    public List<Categorie> getAll() {
        return categorieRepository.findAll();
    }

    @PostMapping
    public Categorie add(@RequestBody Categorie categorie) {
        return categorieRepository.save(categorie);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUserId(@PathVariable Long id){
        Optional<Categorie> categorie= categorieRepository.findById(id);

        if (categorie.isEmpty()){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return  ResponseEntity.ok(categorie);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        categorieRepository.deleteById(id);
        return ResponseEntity.ok("Categorie bien supprimer !");

    }

    @PutMapping("/{id}")
    public Categorie update(@PathVariable Long id, @RequestBody Categorie c) {
        return categorieRepository.findById(id).map(old -> {
            old.setNom(c.getNom());
            return categorieRepository.save(old);
        }).orElse(null);
    }
}
