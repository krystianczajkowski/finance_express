CREATE TABLE user_portfolio (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    user_id INTEGER NOT NULL,
    stock TEXT NOT NULL,
    stock_value NUMERIC NOT NULL,
    quantity INTEGER NOT NULL,
    transaction_date TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    transaction_type TEXT NOT NULL,
    FOREIGN KEY(user_id) REFERENCES users(id));

CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    username TEXT NOT NULL,
    hash TEXT NOT NULL, 
    salt TEXT NOT NULL, 
    cash NUMERIC NOT NULL DEFAULT 10000.00);
CREATE UNIQUE INDEX username ON users (username);
