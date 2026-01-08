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

ALTER TABLE produktivity ADD COLUMN rkpa DECIMAL(10,3) AFTER actual_value

ALTER TABLE produktivity ADD COLUMN actual_value DECIMAL(10,3) AFTER plan

SHOW TABLES

DESC produktivity

ALTER TABLE users RENAME COLUMN update_at TO updated_at

SELECT * FROM company

DESC company

INSERT INTO company (company_name) VALUES ("Tonas"),("Lamongan Shorbase")


SELECT * FROM role

DESC produktivity

ALTER TABLE produktivity DROP COLUMN id_unit

CREATE TABLE user_produktivity (
    user_id INT NOT NULL,
    produktivity_id INT NOT NULL,

    PRIMARY KEY (user_id, produktivity_id),

    CONSTRAINT fk_user_produktivity_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_user_produktivity_produktivity
        FOREIGN KEY (produktivity_id)
        REFERENCES produktivity(id)
        ON DELETE CASCADE
);

ALTER TABLE produktivity DROP COLUMN id_activity

DESC activity
DESC unit

ALTER TABLE unit ADD COLUMN id_activity INT 

CREATE TABLE monthly_plan (
    id INT AUTO_INCREMENT PRIMARY KEY,
    month INT NOT NULL,
    year INT NOT NULL,
    plan INT NOT NULL,
    rkap INT,
    UNIQUE (month,year)
)

ALTER TABLE produktivity DROP COLUMN value_input

ALTER TABLE produktivity ADD COLUMN value_input INT AFTER actual_value

ALTER Table produktivity RENAME COLUMN tanggal TO date

ALTER TABLE produktivity ADD COLUMN id_plan INT AFTER date

ALTER TABLE produktivity ADD CONSTRAINT fk_plan FOREIGN KEY (id_plan) REFERENCES monthly_plan(id)

ALTER TABLE produktivity ADD COLUMN id_unit INT AFTER id_plan

ALTER TABLE produktivity ADD CONSTRAINT fk_unit FOREIGN KEY (id_unit) REFERENCES unit(id)

ALTER TABLE activity ADD CONSTRAINT fk_unit FOREIGN KEY (id_unit) REFERENCES unit(id)

DESC unit

ALTER TABLE unit ADD CONSTRAINT fk_activity FOREIGN KEY (id_activity) REFERENCES activity(id)

SHOW TABLES

DESC produktivity

ALTER TABLE monthly_plan DROP COLUMN year

ALTER TABLE monthly_plan ADD COLUMN date DATE NOT NULL

SELECT * FROM monthly_plan

SELECT * FROM produktivity WHERE id = 2

SELECT * FROM unit

SELECT * FROM activity

DELETE FROM activity WHERE id = 2

SELECT 1
FROM unit
WHERE id_activity = 2
LIMIT 1;

SELECT 1
FROM produktivity
WHERE id_pl = 5
LIMIT 1;

SELECT * FROM users
DESC users

CREATE Table users_activity (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_user INT,
    id_activity INT
)

ALTER TABLE users_activity ADD CONSTRAINT fk_user_activity FOREIGN KEY (id_user) REFERENCES users(id)


DROP TABLE users_activity

CREATE TABLE users_activity (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_user INT NOT NULL,
    id_activity INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE KEY uq_user_activity (id_user, id_activity),

    CONSTRAINT fk_user_activity
        FOREIGN KEY (id_user)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_activity_user
        FOREIGN KEY (id_activity)
        REFERENCES activity(id)
        ON DELETE CASCADE
);

SHOW TABLES

SELECT * FROM activity

SELECT * FROM users_activity