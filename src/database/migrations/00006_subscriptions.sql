-- Criar a tabela de assinaturas
CREATE TABLE subscriptions (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id uuid REFERENCES auth.users ON DELETE CASCADE,
    plan_id uuid REFERENCES plans(id) ON DELETE CASCADE,
    status TEXT CHECK (status IN ('active', 'canceled', 'expired')) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);