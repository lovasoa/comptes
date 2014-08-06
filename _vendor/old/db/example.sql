DROP TABLE IF EXISTS expenses;
CREATE TABLE expenses (
  						id             INTEGER PRIMARY KEY AUTOINCREMENT,
  						description    VARCHAR(50),
						date           INTEGER);

DROP TABLE IF EXISTS users;
CREATE TABLE users (
  						id     INTEGER PRIMARY KEY AUTOINCREMENT,
  						name   VARCHAR(50));

DROP TABLE IF EXISTS accounts;
CREATE TABLE accounts (
  						id          INTEGER PRIMARY KEY AUTOINCREMENT,
  						expense     INTEGER REFERENCES expenses(id),
  						owes        INTEGER REFERENCES users(id),
						isOwed      INTEGER REFERENCES users(id),
						amount      FLOAT,
						CHECK (isOwed > owes));

CREATE INDEX IF NOT EXISTS owe ON accounts (owes, isOwed);


INSERT INTO users (name) VALUES ('Ophir'), ('Vianney'), ('Thomas');

INSERT INTO accounts (expense, owes, isOwed, amount) VALUES (1, 1, 2, 100), (2, 1, 2, -20), (1, 1, 2, 10);


SELECT printf("%s owes %.2f to %s", u1.name, SUM(amount), u2.name)
	from accounts
	INNER JOIN users AS u1 on accounts.owes = u1.id
	INNER JOIN users AS u2 on accounts.isOwed = u2.id
	GROUP BY owes, isOwed;



