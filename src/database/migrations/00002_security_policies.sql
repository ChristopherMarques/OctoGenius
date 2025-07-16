-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE diagnostic_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE subject_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Create or Replace security policies
DO $$ 
BEGIN
  -- Users can view their own data
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE pg_policies.policyname = 'Users can view their own data'
  ) THEN
    CREATE POLICY "Users can view their own data"
      ON users FOR SELECT
      USING (auth.uid() = id);
  ELSE
    ALTER POLICY "Users can view their own data"
      ON users USING (auth.uid() = id);
  END IF;

  -- Users can view their own diagnostic tests
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE pg_policies.policyname = 'Users can view their own diagnostic tests'
  ) THEN
    CREATE POLICY "Users can view their own diagnostic tests"
      ON diagnostic_tests FOR SELECT
      USING (auth.uid() = user_id);
  ELSE
    ALTER POLICY "Users can view their own diagnostic tests"
      ON diagnostic_tests USING (auth.uid() = user_id);
  END IF;

  -- Users can view their own study plans
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE pg_policies.policyname = 'Users can view their own study plans'
  ) THEN
    CREATE POLICY "Users can view their own study plans"
      ON study_plans FOR SELECT
      USING (auth.uid() = user_id);
  ELSE
    ALTER POLICY "Users can view their own study plans"
      ON study_plans USING (auth.uid() = user_id);
  END IF;

  -- Users can view their own progress
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE pg_policies.policyname = 'Users can view their own progress'
  ) THEN
    CREATE POLICY "Users can view their own progress"
      ON subject_progress FOR SELECT
      USING (auth.uid() = user_id);
  ELSE
    ALTER POLICY "Users can view their own progress"
      ON subject_progress USING (auth.uid() = user_id);
  END IF;

  -- Public read access to questions
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE pg_policies.policyname = 'Public read access to questions'
  ) THEN
    CREATE POLICY "Public read access to questions"
      ON questions FOR SELECT
      TO authenticated
      USING (true);
  ELSE
    ALTER POLICY "Public read access to questions"
      ON questions USING (true);
  END IF;

  -- Allow anonymous users to list plans
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE pg_policies.policyname = 'Public read access to plans'
  ) THEN
    CREATE POLICY "Public read access to plans"
      ON plans FOR SELECT
      TO public
      USING (true);
  ELSE
    ALTER POLICY "Public read access to plans"
      ON plans USING (true);
  END IF;

  -- Users can view their own subscriptions
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE pg_policies.policyname = 'Users can view their own subscriptions'
  ) THEN
    CREATE POLICY "Users can view their own subscriptions"
      ON subscriptions FOR SELECT
      USING (auth.uid() = user_id);
  ELSE
    ALTER POLICY "Users can view their own subscriptions"
      ON subscriptions USING (auth.uid() = user_id);
  END IF;

  -- Users can insert their own user row
IF NOT EXISTS (
  SELECT 1 FROM pg_policies WHERE pg_policies.policyname = 'Users can insert their own user row'
) THEN
  CREATE POLICY "Users can insert their own user row"
    ON users FOR INSERT
     WITH CHECK (id = auth.uid());
ELSE
  ALTER POLICY "Users can insert their own user row"
    ON users WITH CHECK (id = auth.uid());
END IF;

END $$;
