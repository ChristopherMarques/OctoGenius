-- Habilitar RLS na tabela users
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Política para permitir inserção de usuários autenticados
CREATE POLICY "Users can insert their own data" ON users
    FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Política para permitir leitura do próprio perfil
CREATE POLICY "Users can view their own data" ON users
    FOR SELECT
    USING (auth.uid() = id);

-- Política para permitir atualização do próprio perfil
CREATE POLICY "Users can update their own data" ON users
    FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Política para permitir upsert através do auth.uid()
CREATE POLICY "Enable upsert for authenticated users" ON users
    FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Permitir que o serviço de autenticação gerencie os usuários
CREATE POLICY "Service role can manage users" ON users
    USING (auth.role() = 'service_role');

-- Garantir que o service role tenha acesso total à tabela
GRANT ALL ON users TO service_role;
GRANT USAGE ON SCHEMA public TO service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;