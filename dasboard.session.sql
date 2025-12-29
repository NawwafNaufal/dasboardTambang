USE dasboard_tambang

CREATE Table users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200),
    id_company INT,
    id_role INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)

SHOW TABLES

DESC users

DROP TABLE users

create table company (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company_name VARCHAR (100)
)

CREATE TABLE role (
    id INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(30)
)

ALTER TABLE users ADD CONSTRAINT fk_company FOREIGN KEY (id_company) REFERENCES company(id)
ALTER TABLE users ADD CONSTRAINT fk_role FOREIGN KEY (id_role) REFERENCES role(id)

CREATE TABLE produktivity (
    id INT AUTO_INCREMENT PRIMARY KEY,
    plan DECIMAL(10,2),
    tanggal DATETIME DEFAULT CURRENT_TIMESTAMP,
    id_company INT,
    id_unit INT,
    id_activity INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE activity (
    id INT AUTO_INCREMENT PRIMARY KEY,
    activity_name VARCHAR(100)
)

CREATE TABLE unit (
    id INT AUTO_INCREMENT PRIMARY KEY,
    unit_name VARCHAR(100)
)

CREATE TABLE rkpa (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tanggal DATE,
    activity_id INT,
    target_value DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)

SHOW TABLES

DESC users

ALTER TABLE users RENAME COLUMN update_at TO updated_at