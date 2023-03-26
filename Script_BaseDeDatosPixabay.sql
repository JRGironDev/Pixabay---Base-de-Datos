create database pixabay;

use pixabay;

CREATE TABLE imagenes (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  previewURL VARCHAR(255) NOT NULL,
  largeImageURL VARCHAR(255) NOT NULL,
  queryBD VARCHAR(55) NOT NULL
);

CREATE TABLE totalpaginas (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  totalPaginas INT NOT NULL,
  queryBD VARCHAR(55) NOT NULL UNIQUE,
  fechaBD VARCHAR(15) NOT NULL
);







