module.exports =  {
    initialQuery: `CREATE TABLE IF NOT EXISTS usertodo (
        id BIGSERIAL PRIMARY KEY,
        username VARCHAR NOT NULL,
        password VARCHAR NOT NULL,
        c_at TIMESTAMP DEFAULT NOW(),
        u_at TIMESTAMP DEFAULT NOW(),
        deleted BOOLEAN DEFAULT FALSE
    );

    CREATE INDEX IF NOT EXISTS id_user_idx ON usertodo (id);
    CREATE INDEX IF NOT EXISTS username_user_idx ON usertodo (username, id); 
    
    ALTER TABLE usertodo ADD COLUMN IF NOT EXISTS name VARCHAR NOT NULL;
    ALTER TABLE usertodo ALTER COLUMN c_at TYPE DATE;
    ALTER TABLE usertodo ALTER COLUMN u_at TYPE DATE;
    CREATE TABLE IF NOT EXISTS todo (
        id BIGSERIAL PRIMARY KEY,
        name VARCHAR NOT NULL,
        endDate TIMESTAMP NOT NULL,
        c_at TIMESTAMP DEFAULT NOW(),
        u_at TIMESTAMP DEFAULT NOW(),
        deleted BOOLEAN DEFAULT FALSE,
        isDone BOOLEAN DEFAULT FALSE,
        userId INT NOT NULL,
        FOREIGN KEY (userId) REFERENCES usertodo (id)
    );

    CREATE INDEX IF NOT EXISTS id_user_todo_idx ON todo (id);
    CREATE INDEX IF NOT EXISTS name_todo_idx ON todo (name, id);
    CREATE INDEX IF NOT EXISTS date_todo_idx ON todo (c_at, id);
    CREATE INDEX IF NOT EXISTS endDate_todo_idx ON todo (endDate, id);

    ALTER TABLE todo ALTER COLUMN c_at TYPE DATE;
    ALTER TABLE todo ALTER COLUMN u_at TYPE DATE;
    ALTER TABLE todo ALTER COLUMN enddate TYPE DATE;
    `
}