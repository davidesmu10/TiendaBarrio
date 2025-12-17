package com.example.demo.repository;

import com.example.demo.model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {

    @Procedure(name = "sp_get_all_products")
    List<Producto> sp_get_all_products();

    @Procedure(name = "sp_get_product_by_id")
    Producto sp_get_product_by_id(@Param("p_id") Long p_id);

    // Mapeo al procedimiento almacenado de creación actualizado
    @Procedure(name = "sp_create_product")
    Integer sp_create_product(
        @Param("p_nombre") String p_nombre,
        @Param("p_descripcion") String p_descripcion,
        @Param("p_precio") double p_precio,
        @Param("p_stock") int p_stock,
        @Param("p_imagen_url") String p_imagen_url,
        @Param("p_rating_promedio") double p_rating_promedio,
        @Param("p_categoria_id") Long p_categoria_id
    );

    // Mapeo al procedimiento almacenado de actualización actualizado
    @Procedure(name = "sp_update_product")
    void sp_update_product(
        @Param("p_id") Long p_id,
        @Param("p_nombre") String p_nombre,
        @Param("p_descripcion") String p_descripcion,
        @Param("p_precio") double p_precio,
        @Param("p_stock") int p_stock,
        @Param("p_imagen_url") String p_imagen_url,
        @Param("p_rating_promedio") double p_rating_promedio,
        @Param("p_categoria_id") Long p_categoria_id
    );

    @Procedure(name = "sp_delete_product")
    void sp_delete_product(@Param("p_id") Long p_id);
}
