-- =====================================================================
-- SCRIPT DE RESETEO COMPLETO PARA LA BASE DE DATOS DE TIENDA DE BARRIO
-- =====================================================================

-- PASO 1: ELIMINAR OBJETOS ANTIGUOS PARA EMPEZAR DE CERO
-- ---------------------------------------------------------------------

-- Eliminar tablas en orden inverso para evitar problemas de claves foráneas
DROP TABLE IF EXISTS resenas;
DROP TABLE IF EXISTS pedidos;
DROP TABLE IF EXISTS productos;
DROP TABLE IF EXISTS categoria;

-- Eliminar los procedimientos almacenados
DROP PROCEDURE IF EXISTS sp_get_all_products;
DROP PROCEDURE IF EXISTS sp_get_product_by_id;
DROP PROCEDURE IF EXISTS sp_create_product;
DROP PROCEDURE IF EXISTS sp_update_product;
DROP PROCEDURE IF EXISTS sp_delete_product;
DROP PROCEDURE IF EXISTS sp_get_all_orders;
DROP PROCEDURE IF EXISTS sp_get_order_by_id;
DROP PROCEDURE IF EXISTS sp_create_order;
DROP PROCEDURE IF EXISTS sp_update_order;
DROP PROCEDURE IF EXISTS sp_delete_order;
DROP PROCEDURE IF EXISTS sp_get_reviews_by_product_id;
DROP PROCEDURE IF EXISTS sp_create_review;

-- PASO 2: CREAR LAS TABLAS CON LA ESTRUCTURA CORRECTA
-- ---------------------------------------------------------------------

-- Creación de la tabla de categorías
CREATE TABLE categoria (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT
);

-- Creación de la tabla de productos
CREATE TABLE productos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    precio DOUBLE NOT NULL,
    stock INT NOT NULL,
    imagen_url VARCHAR(255),
    rating_promedio DOUBLE,
    categoria_id BIGINT,
    CONSTRAINT fk_categoria
        FOREIGN KEY (categoria_id) 
        REFERENCES categoria(id)
);

-- Creación de otras tablas (opcional, pero basado en tus procedimientos)
CREATE TABLE pedidos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre_cliente VARCHAR(255),
    direccion_cliente VARCHAR(255),
    total DECIMAL(10, 2)
);

CREATE TABLE resenas (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_producto BIGINT,
    autor VARCHAR(255),
    comentario TEXT,
    calificacion INT,
    CONSTRAINT fk_producto_resena
        FOREIGN KEY (id_producto) 
        REFERENCES productos(id)
);


-- PASO 3: INSERTAR DATOS DE EJEMPLO
-- ---------------------------------------------------------------------

-- Insertar categorías
INSERT INTO categoria (id, nombre, descripcion) VALUES
(1, 'Abarrotes', 'Productos básicos no perecederos como enlatados, granos y aceites.'),
(2, 'Lácteos y Huevos', 'Leche, quesos, yogures, mantequilla y huevos.'),
(3, 'Frutas y Verduras', 'Productos frescos del campo.'),
(4, 'Carnes y Embutidos', 'Carnes frescas, pollo y una selección de embutidos.'),
(5, 'Panadería y Dulces', 'Pan fresco del día, galletas y golosinas.'),
(6, 'Bebidas', 'Gaseosas, jugos, agua y otras bebidas.'),
(7, 'Limpieza del Hogar', 'Productos para mantener la casa limpia y ordenada.');

-- Insertar 40 productos para la tienda de barrio
INSERT INTO productos (nombre, descripcion, precio, stock, imagen_url, rating_promedio, categoria_id) VALUES
-- Abarrotes (Cat 1)
('Arroz Blanco (kilo)', 'Grano de arroz blanco de primera calidad.', 1.20, 150, 'https://example.com/arroz.jpg', 4.5, 1),
('Frijoles Negros (kilo)', 'Frijoles negros secos, ideales para sopas y guisos.', 1.80, 120, 'https://example.com/frijoles.jpg', 4.7, 1),
('Aceite Vegetal (litro)', 'Aceite de girasol para cocinar.', 2.50, 80, 'https://example.com/aceite.jpg', 4.2, 1),
('Atún en Lata (aceite)', 'Lata de atún en aceite de 140g.', 1.50, 200, 'https://example.com/atun.jpg', 4.8, 1),
('Sal de Mesa (500g)', 'Sal yodada para uso general en la cocina.', 0.80, 300, 'https://example.com/sal.jpg', 4.9, 1),
('Azúcar Blanca (kilo)', 'Azúcar de caña refinada.', 1.10, 180, 'https://example.com/azucar.jpg', 4.6, 1),
('Pasta de Tomate (lata)', 'Concentrado de tomate para salsas.', 0.90, 150, 'https://example.com/pasta_tomate.jpg', 4.3, 1),

-- Lácteos y Huevos (Cat 2)
('Leche Entera (litro)', 'Leche de vaca pasteurizada, cartón de 1 litro.', 1.40, 60, 'https://example.com/leche.jpg', 4.8, 2),
('Queso Fresco (250g)', 'Queso blanco y suave, ideal para ensaladas.', 2.80, 40, 'https://example.com/queso_fresco.jpg', 4.7, 2),
('Huevos (docena)', 'Docena de huevos de gallina de corral.', 2.20, 50, 'https://example.com/huevos.jpg', 4.9, 2),
('Yogurt Natural (litro)', 'Yogurt natural sin azúcar.', 2.50, 30, 'https://example.com/yogurt.jpg', 4.5, 2),
('Mantequilla con Sal (200g)', 'Barra de mantequilla con sal.', 1.90, 45, 'https://example.com/mantequilla.jpg', 4.6, 2),

-- Frutas y Verduras (Cat 3)
('Tomate (kilo)', 'Tomate para ensalada fresco.', 1.50, 70, 'https://example.com/tomate.jpg', 4.4, 3),
('Cebolla Blanca (kilo)', 'Cebolla blanca para guisos.', 1.00, 90, 'https://example.com/cebolla.jpg', 4.5, 3),
('Papa (kilo)', 'Papa blanca para todo uso.', 0.80, 120, 'https://example.com/papa.jpg', 4.6, 3),
('Manzanas Rojas (kilo)', 'Manzanas rojas dulces y crujientes.', 2.00, 50, 'https://example.com/manzana.jpg', 4.7, 3),
('Plátanos (kilo)', 'Plátanos maduros, ricos en potasio.', 1.30, 60, 'https://example.com/platano.jpg', 4.8, 3),
('Aguacate', 'Aguacate Hass, se vende por unidad.', 1.00, 40, 'https://example.com/aguacate.jpg', 4.9, 3),

-- Carnes y Embutidos (Cat 4)
('Pechuga de Pollo (kilo)', 'Pechuga de pollo fresca, sin hueso ni piel.', 7.00, 25, 'https://example.com/pechuga_pollo.jpg', 4.8, 4),
('Carne Molida de Res (kilo)', 'Carne de res molida 80/20.', 8.50, 20, 'https://example.com/carne_molida.jpg', 4.7, 4),
('Jamón de Pavo (200g)', 'Paquete de jamón de pavo en rebanadas.', 3.20, 35, 'https://example.com/jamon_pavo.jpg', 4.5, 4),
('Salchichas (paquete)', 'Paquete de 8 salchichas tipo Viena.', 2.10, 50, 'https://example.com/salchichas.jpg', 4.3, 4),
('Chorizo para Asar (kilo)', 'Chorizo fresco de cerdo para la parrilla.', 6.50, 15, 'https://example.com/chorizo.jpg', 4.9, 4),

-- Panadería y Dulces (Cat 5)
('Pan Francés (unidad)', 'Baguette de pan fresco del día.', 0.50, 80, 'https://example.com/pan_frances.jpg', 4.8, 5),
('Galletas de Chocolate (paquete)', 'Paquete de galletas con chispas de chocolate.', 1.80, 100, 'https://example.com/galletas.jpg', 4.6, 5),
('Chocolate en Barra (90g)', 'Tableta de chocolate con leche.', 1.20, 120, 'https://example.com/chocolate.jpg', 4.7, 5),
('Pan de Molde Blanco', 'Pan de molde para sándwiches.', 2.00, 60, 'https://example.com/pan_molde.jpg', 4.5, 5),
('Gomitas de Frutas (bolsa)', 'Bolsa de 100g de gomitas surtidas.', 1.00, 150, 'https://example.com/gomitas.jpg', 4.2, 5),

-- Bebidas (Cat 6)
('Coca-Cola (2 litros)', 'Bebida gaseosa sabor cola, botella de 2L.', 2.50, 70, 'https://example.com/cocacola.jpg', 4.9, 6),
('Agua Purificada (botella 1.5L)', 'Botella de agua sin gas.', 1.00, 200, 'https://example.com/agua.jpg', 5.0, 6),
('Jugo de Naranja (litro)', 'Jugo de naranja 100% natural, cartón de 1L.', 2.20, 50, 'https://example.com/jugo_naranja.jpg', 4.6, 6),
('Café Instantáneo (frasco 100g)', 'Frasco de café instantáneo clásico.', 4.50, 40, 'https://example.com/cafe.jpg', 4.7, 6),
('Cerveza Nacional (lata)', 'Lata de cerveza pilsener de 355ml.', 1.10, 150, 'https://example.com/cerveza.jpg', 4.8, 6),

-- Limpieza del Hogar (Cat 7)
('Detergente en Polvo (kilo)', 'Detergente multiusos para ropa.', 3.00, 60, 'https://example.com/detergente.jpg', 4.5, 7),
('Lavaplatos Líquido (500ml)', 'Lavavajillas líquido con aroma a limón.', 1.80, 80, 'https://example.com/lavaplatos.jpg', 4.6, 7),
('Papel Higiénico (paquete 4 rollos)', 'Paquete de 4 rollos de papel de doble hoja.', 2.00, 100, 'https://example.com/papel_higienico.jpg', 4.8, 7),
('Cloro (litro)', 'Botella de cloro para desinfección.', 1.20, 90, 'https://example.com/cloro.jpg', 4.7, 7),
('Bolsas de Basura (rollo)', 'Rollo de 20 bolsas grandes para basura.', 1.50, 120, 'https://example.com/bolsas_basura.jpg', 4.4, 7);


-- PASO 4: RECREAR LOS PROCEDIMIENTOS ALMACENADOS
-- ---------------------------------------------------------------------

DELIMITER //

-- Procedimiento para obtener TODOS los productos
CREATE PROCEDURE `sp_get_all_products`()
BEGIN
    SELECT * FROM productos;
END //

-- Procedimiento para obtener un producto por su ID
CREATE PROCEDURE `sp_get_product_by_id`(IN `p_id` BIGINT)
BEGIN
    SELECT * FROM productos WHERE id = p_id;
END //

-- Procedimiento para CREAR un producto
CREATE PROCEDURE `sp_create_product`(
    IN `p_nombre` VARCHAR(255),
    IN `p_descripcion` TEXT,
    IN `p_precio` DOUBLE,
    IN `p_stock` INT,
    IN `p_imagen_url` VARCHAR(255),
    IN `p_rating_promedio` DOUBLE,
    IN `p_categoria_id` BIGINT
)
BEGIN
    INSERT INTO productos (nombre, descripcion, precio, stock, imagen_url, rating_promedio, categoria_id)
    VALUES (p_nombre, p_descripcion, p_precio, p_stock, p_imagen_url, p_rating_promedio, p_categoria_id);
    SELECT LAST_INSERT_ID();
END //

-- Procedimiento para ACTUALIZAR un producto
CREATE PROCEDURE `sp_update_product`(
    IN `p_id` BIGINT,
    IN `p_nombre` VARCHAR(255),
    IN `p_descripcion` TEXT,
    IN `p_precio` DOUBLE,
    IN `p_stock` INT,
    IN `p_imagen_url` VARCHAR(255),
    IN `p_rating_promedio` DOUBLE,
    IN `p_categoria_id` BIGINT
)
BEGIN
    UPDATE productos
    SET
        nombre = p_nombre,
        descripcion = p_descripcion,
        precio = p_precio,
        stock = p_stock,
        imagen_url = p_imagen_url,
        rating_promedio = p_rating_promedio,
        categoria_id = p_categoria_id
    WHERE id = p_id;
END //

-- Procedimiento para BORRAR un producto
CREATE PROCEDURE `sp_delete_product`(IN `p_id` BIGINT)
BEGIN
    DELETE FROM productos WHERE id = p_id;
END //

DELIMITER ;
