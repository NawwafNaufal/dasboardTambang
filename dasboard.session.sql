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

SELECT * FROM produktivity LIMIT 10 OFFSET

SELECT actual_value,value_input,date,id_plan,id_unit
FROM produktivity
ORDER BY id DESC
LIMIT 10 OFFSET 0;


SELECT * FROM produktivity

ALTER TABLE produktivity ADD INDEX 

CREATE INDEX idx_date ON produktivity (date);

DESC produktivity

SELECT * FROM produktivity
JOIN unit ON unit.id = produktivity.id_unit
JOIN activity ON activity.id = unit.id_activity
GROUP BY activity.id
WHERE (
    COUNT(*) 
)

SELECT * FROM unit


SELECT 
    activity.id AS activity_id,
    activity.activity_name,
    produktivity.date,
    mp.plan,
    SUM(produktivity.value_input) AS total_value_input
FROM produktivity
JOIN unit ON unit.id = produktivity.id_unit
JOIN activity ON activity.id = unit.id_activity
JOIN monthly_plan AS mp ON mp.id = produktivity.id_plan 
GROUP BY 
    activity.id,
    produktivity.date,
    mp.plan
ORDER BY 
    produktivity.date DESC;

SHOW TABLES

DESc monthly_plan

SELECT 
    activity.id AS activity_id,
    mp.plan,
    mp.rkap,
    produktivity.date,
    activity.activity_name,
    SUM(produktivity.value_input) AS actual
FROM produktivity
JOIN unit 
    ON unit.id = produktivity.id_unit
JOIN activity 
    ON activity.id = unit.id_activity
JOIN monthly_plan mp 
    ON mp.id = produktivity.id_plan
GROUP BY 
    activity.id,
    activity.activity_name,
    produktivity.date,
    mp.plan,
    mp.rkap
ORDER BY 
    produktivity.date DESC
LIMIT 10 OFFSET 0;


SELECT * FROM produktivity
JOIN unit ON unit.id = produktivity.id_unit
GROUP BY
    produktivity.date

SELECT * FROM produktivity

SELECT
    produktivity.date,
    unit.unit_name,
    SUM(produktivity.value_input) AS value_input
FROM produktivity
JOIN unit ON unit.id = produktivity.id_unit
GROUP BY
    produktivity.date,
    unit.id,
    unit.unit_name
ORDER BY
    produktivity.date DESC
LIMIT 10 OFFSET 0;


SELECT  
    produktivity.date,
    activity.activity_name,
    mp.plan,
    mp.rkap,
    SUM(produktivity.value_input) AS actual
FROM produktivity
JOIN unit 
    ON unit.id = produktivity.id_unit
JOIN activity 
    ON activity.id = unit.id_activity
JOIN monthly_plan mp 
    ON mp.id = produktivity.id_plan
WHERE 
    MONTH(produktivity.date) = 1
    AND YEAR(produktivity.date) = 2026
GROUP BY
    produktivity.date,
    activity.id,
    activity.activity_name,
    mp.plan,
    mp.rkap
ORDER BY produktivity.date ASC;

SELECT id, date, id_plan
FROM produktivity
WHERE MONTH(date)=1 AND YEAR(date)=2026;

SELECT id, date, plan, rkap
FROM monthly_plan;

SELECT * FROM monthly_plan WHERE id = 1;

