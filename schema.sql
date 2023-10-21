CREATE TABLE transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    date TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    user_id INTEGER NOT NULL,
    stock_value NUMERIC NOT NULL,
    stock TEXT,
    quantity INTEGER,
    transaction_type TEXT,
    FOREIGN KEY(user_id) REFERENCES users(id));

CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    username TEXT NOT NULL,
    hash TEXT NOT NULL, 
    salt TEXT NOT NULL, 
    cash NUMERIC NOT NULL DEFAULT 10000.00);
CREATE UNIQUE INDEX username ON users (username);

CREATE TABLE user_stock (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    user_id INTEGER NOT NULL,
    stock TEXT NOT NULL,
    value NUMERIC NOT NULL,
    quantity INTEGER,
    FOREIGN KEY(user_id) REFERENCES users(id));
