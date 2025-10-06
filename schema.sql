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

CREATE TABLE public.course_ratings (
    id SERIAL PRIMARY KEY,
    course_id INT4 NOT NULL,
    user_id INT4 NOT NULL,
    rating INT4 NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT course_ratings_course_fk FOREIGN KEY (course_id) 
        REFERENCES public.courses(id) ON DELETE CASCADE,
    CONSTRAINT course_ratings_user_fk FOREIGN KEY (user_id) 
        REFERENCES public.users(id) ON DELETE CASCADE,
    CONSTRAINT unique_user_course_rating UNIQUE(user_id, course_id)
);

create table if not exists favorites(
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  course_id INT4 NOT NULL,
  user_id INT4 not null
)

CREATE TABLE IF NOT EXISTS cart(
    id serial PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    course_id int4 NOT NULL,
    user_id int4 NOT NULL
    )

    CREATE TABLE IF NOT EXISTS bought_courses(
    id serial PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    course_id int4 NOT NULL,
    user_id int4 NOT NULL
    )

