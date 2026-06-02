package com.gafahtec.consultorio.model.auth;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Setter
@Getter
@Entity
@Table(name = "categoria_menu")
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString(exclude = { "menus" })
@EqualsAndHashCode(exclude = { "menus" })
public class CategoriaMenu {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_categoria")
    private Integer idCategoria;

    @Column(name = "nombre", nullable = false, unique = true, length = 100)
    private String nombre;

    @Column(name = "orden")
    private Integer orden;

    @Column(name = "activo", nullable = false)
    @Builder.Default
    private Boolean activo = true;

    @JsonIgnore
    @Builder.Default
    @OneToMany(mappedBy = "categoria", fetch = FetchType.LAZY)
    private Set<Menu> menus = new HashSet<>();
}
