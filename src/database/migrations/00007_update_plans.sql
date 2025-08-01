-- Adicionar campos relacionados ao Stripe na tabela plans
ALTER TABLE plans
ADD COLUMN stripe_price_id TEXT;