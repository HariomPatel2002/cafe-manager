CREATE TABLE users (
    id        INT          PRIMARY KEY AUTO_INCREMENT,
    name      VARCHAR(250) NOT NULL,
    contactNumber VARCHAR(20),
    email     VARCHAR(50)  NOT NULL,
    password  VARCHAR(250) NOT NULL,
    status    ENUM('true', 'false') DEFAULT 'true',
    role      ENUM('admin', 'user') DEFAULT 'user',
    UNIQUE (email)
);

INSERT INTO users (name, contactNumber, email, password, status, role)
VALUES ('Admin', '1234567890', 'admin@email.com', 'admin', 'true', 'admin');

create table category(
    id int not NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    PRIMARY KEY(id)
);

create table products (
    id int NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    categoryId integer NOT NULL,
    description VARCHAR(255),
    price integer,
    status VARCHAR(20),
    PRIMARY key(id)
);
 
 create table bill{
    id int NOT NULL AUTO_INCREMENT,
    uuid VARCHAR(200) NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    contactNumber VARCHAR(20) NOT NULL,
    paymentMethod VARCHAR(50) NOT NULL,
    total integer NOT NULL,
    productsDetails JSON DEFAULT NULL,
    createBy VARCHAR(255) NOT NULL,
    PRIMARY KEY(id)
};