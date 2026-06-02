package com.gafahtec.consultorio.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.gafahtec.consultorio.model.auth.Token;

public interface ITokenRepository extends JpaRepository<Token, Integer> {

  @Query(value = """
      select t from Token t inner join Usuario u\s
      on t.usuario.idUsuario = u.idUsuario\s
      where u.id = :id and (t.expired = false or t.revoked = false)\s
      """)
  List<Token> findAllValidTokenByUser(Integer id);

  Optional<Token> findByToken(String token);
}
