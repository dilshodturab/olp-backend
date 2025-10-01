CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

CREATE TABLE IF NOT EXISTS courses (
	id serial4 NOT NULL,
	course_name varchar(255) NOT NULL,
	description text NULL,
	thumbnail_url varchar(500) NULL,
	video_url varchar(500) NULL,
	author int4 NOT NULL,
  price DECIMAL(10,2) DEFAULT 0.00 CHECK (price >= 0),
  rating DECIMAL(2,1) DEFAULT 0.0 CHECK (rating >= 0.0 AND rating <= 5.0),
	created_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	updated_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT courses_pkey PRIMARY KEY (id),
	CONSTRAINT courses_author_fkey FOREIGN KEY (author) REFERENCES public.users(id) ON DELETE CASCADE
);




