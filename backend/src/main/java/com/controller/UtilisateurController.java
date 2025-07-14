package com.controller;

import com.model.Utilisateur;
import com.repository.UtilisateurRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/utilisateurs")
public class UtilisateurController {

    private final UtilisateurRepository utilisateurRepository;

    public UtilisateurController(UtilisateurRepository utilisateurRepository) {
        this.utilisateurRepository = utilisateurRepository;
    }

    @GetMapping
    public ResponseEntity<?>  getAll() {
        List<Utilisateur> usersR= utilisateurRepository.findAll();
        List<Map<String, Object>> userData =new ArrayList<>();
        for (int i = 0; i < usersR.toArray().length; i++) {
            Map<String, Object> temp = new HashMap<>();
            temp.put("userId",usersR.get(i).getId());
            temp.put("email",usersR.get(i).getLogin());
            temp.put("role",usersR.get(i).getRole());
            userData.add(temp);
        }


        return new ResponseEntity<>(userData, HttpStatus.OK)  ;
    }

    @PostMapping
    public Utilisateur add(@RequestBody Utilisateur utilisateur) {
        return utilisateurRepository.save(utilisateur);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        utilisateurRepository.deleteById(id);
    }


    @PutMapping("/{id}")
    public Utilisateur update(@PathVariable Long id, @RequestBody Utilisateur updated) {
        return utilisateurRepository.findById(id).map(u -> {
            u.setNom(updated.getNom());
            u.setLogin(updated.getLogin());
            u.setMotDePasse(updated.getMotDePasse());
            u.setRole(updated.getRole());
            return utilisateurRepository.save(u);
        }).orElse(null);
    }
}
