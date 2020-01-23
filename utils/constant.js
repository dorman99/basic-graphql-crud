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
    `
}