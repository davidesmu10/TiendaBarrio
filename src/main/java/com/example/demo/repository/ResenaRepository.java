package com.example.demo.repository;

import com.example.demo.model.Resena;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResenaRepository extends JpaRepository<Resena, Long> {

    @Procedure(name = "sp_get_all_reviews")
    List<Resena> sp_get_all_reviews();

    @Procedure(name = "sp_get_review_by_id")
    Resena sp_get_review_by_id(@Param("p_id") Long p_id);

    @Procedure(name = "sp_create_review")
    void sp_create_review(@Param("p_producto_id") Long p_producto_id, 
                          @Param("p_nombre_cliente") String p_nombre_cliente, 
                          @Param("p_calificacion") int p_calificacion, 
                          @Param("p_comentario") String p_comentario);

    @Procedure(name = "sp_update_review")
    void sp_update_review(@Param("p_id") Long p_id, 
                          @Param("p_producto_id") Long p_producto_id, 
                          @Param("p_nombre_cliente") String p_nombre_cliente, 
                          @Param("p_calificacion") int p_calificacion, 
                          @Param("p_comentario") String p_comentario);

    @Procedure(name = "sp_delete_review")
    void sp_delete_review(@Param("p_id") Long p_id);
    
    @Procedure(name = "sp_get_reviews_by_product_id")
    List<Resena> sp_get_reviews_by_product_id(@Param("p_producto_id") Long p_producto_id);
}
