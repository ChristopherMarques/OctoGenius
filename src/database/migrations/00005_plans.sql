-- Criar a tabela de planos
CREATE TABLE plans (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    price INTEGER NOT NULL, -- Em centavos (ex: 1990 para R$19,90)
    features TEXT[] NOT NULL, -- Array de funcionalidades do plano
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
