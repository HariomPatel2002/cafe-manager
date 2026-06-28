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
)