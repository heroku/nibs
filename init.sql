CREATE TABLE IF NOT EXISTS tokens (
    userId           BIGSERIAL,
    externalUserId   TEXT,
    token            TEXT NOT NULL UNIQUE,
    created          TIMESTAMP DEFAULT now()
  );

CREATE TABLE IF NOT EXISTS wallet (
    userId       BIGINT,
    offerId      BIGINT
  );

CREATE TABLE IF NOT EXISTS wishlist (
    userId       BIGINT,
    productId    BIGINT
  );

CREATE TABLE IF NOT EXISTS picture (
    id           BIGSERIAL,
    userId       BIGINT,
    url          TEXT,
    publishDate  timestamp default current_timestamp
  );



