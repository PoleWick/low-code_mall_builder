USE mall_builder;

CREATE TABLE IF NOT EXISTS orders (
  id             INT PRIMARY KEY AUTO_INCREMENT,
  page_id        INT DEFAULT NULL,
  items          LONGTEXT NOT NULL,
  total_price    DECIMAL(10, 2) NOT NULL DEFAULT 0,
  pickup_number  VARCHAR(6) NOT NULL,
  status         TINYINT NOT NULL DEFAULT 1,
  created_at     DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_pickup (pickup_number),
  INDEX idx_page_id (page_id),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
