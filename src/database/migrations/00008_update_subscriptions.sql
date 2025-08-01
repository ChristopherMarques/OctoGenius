-- Adicionar campos relacionados ao Stripe na tabela subscriptions
ALTER TABLE subscriptions
ADD COLUMN stripe_subscription_id TEXT,
ADD COLUMN payment_status TEXT CHECK (payment_status IN ('paid', 'unpaid', 'pending')) DEFAULT 'pending';