package com.controller;

import com.configuration.JwtUtils;
import com.model.Role;
import com.model.Utilisateur;
import com.repository.UtilisateurRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Arrays; // Pour l'exemple des rôles factices
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth") // Le chemin de base pour toutes les routes d'authentification
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    PasswordEncoder passwordEncoder;

    final UtilisateurRepository utilisateurRepository;

    public AuthController(UtilisateurRepository utilisateurRepository) {
        this.utilisateurRepository = utilisateurRepository;
    }

    @PostMapping("/register")
    public ResponseEntity<?> creerUtilisateur(@RequestBody Utilisateur utilisateur){
        if (utilisateurRepository.findByLogin(utilisateur.getLogin()).isPresent()){
            return new ResponseEntity<>("username deja utiliser",HttpStatus.BAD_REQUEST);
        }

        utilisateur.setMotDePasse(passwordEncoder.encode(utilisateur.getMotDePasse()));
        utilisateurRepository.save(utilisateur);
        return ResponseEntity.ok("L'utilisateut "+utilisateur.getPrenom()+" "+utilisateur.getNom());
    }




    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody UserCredentials credentials) {
        if (credentials.getEmail().isEmpty() ||credentials.getPassword().isEmpty()) {
            return new ResponseEntity<>("Email et mot de passe sont requis.", HttpStatus.BAD_REQUEST);
        }

        try {
            Authentication authentication= authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(credentials.getEmail(),credentials.getPassword()));
           if (authentication.isAuthenticated()){
               Optional<Utilisateur> utilisateurO= utilisateurRepository.findByLogin(credentials.getEmail());
               Utilisateur utilisateur=utilisateurO.get();
               String token=jwtUtils.generateToken(credentials.getEmail());
               AuthResponse authResponse= new AuthResponse(token, utilisateur.getId(), utilisateur.getLogin(), utilisateur.getRole());
               return ResponseEntity.ok(authResponse);
            }

           return new ResponseEntity<>("Identifiants invalides.", HttpStatus.UNAUTHORIZED); // 401 Unauthorized

        } catch (AuthenticationException e) {
            return ResponseEntity.status((HttpStatus.UNAUTHORIZED)).body("invalide username ou mot de pass"+e.getMessage());
        }
    }


    @GetMapping("/currentuser")
    public ResponseEntity<?> getCurrentUser(Principal principal){
        Optional<Utilisateur> user=utilisateurRepository.findByLogin(principal.getName());
        if (user.isEmpty()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User non trouvé.");
        }
        return ResponseEntity.ok(user);
    }

    public static class UserCredentials {
        private String email;
        private String password;

        // Getters et Setters
        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }
    }

    public class AuthResponse {
        private String token;
        private UtilisateurDTO user; // Maintenant un objet UtilisateurDTO

        public AuthResponse(String token,Long userId,String email,Role role) {
            this.token = token;
            this.user=new UtilisateurDTO(userId,email,role);
        }

        public AuthResponse(String token, UtilisateurDTO user) {
            this.token = token;
            this.user = user;
        }

        // --- Getters et Setters ---
        public String getToken() {
            return token;
        }

        public void setToken(String token) {
            this.token = token;
        }

        public UtilisateurDTO getUser() {
            return user;
        }

        public void setUser(UtilisateurDTO user) {
            this.user = user;
        }
    }

    public class UtilisateurDTO{
        private Long userId;
        private String email;
        private Role role;

        public UtilisateurDTO(Long userId, String email, Role role) {
            this.userId = userId;
            this.email = email;
            this.role = role;
        }

        public Long getUserId() {
            return userId;
        }

        public void setUserId(Long userId) {
            this.userId = userId;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public Role getRole() {
            return role;
        }

        public void setRole(Role role) {
            this.role = role;
        }
    }


}