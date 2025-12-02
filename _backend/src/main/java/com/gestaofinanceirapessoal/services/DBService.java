package com.gestaofinanceirapessoal.services;

import com.gestaofinanceirapessoal.domains.*;
import com.gestaofinanceirapessoal.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class DBService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder encoder;

    public void initDB() {

        Usuario user1 = new Usuario(null, "50450732061", "Administrador",
                "administrador@email.com", encoder.encode("1234"), LocalDate.now());

        Usuario user2 = new Usuario(null, "87040351005", "Usuario",
                "usuario@email.com", encoder.encode("1234"), LocalDate.now());

        usuarioRepository.save(user1);
        usuarioRepository.save(user2);

    }
}
