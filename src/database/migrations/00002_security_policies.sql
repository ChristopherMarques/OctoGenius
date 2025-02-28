-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE diagnostic_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE subject_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_stats ENABLE ROW LEVEL SECURITY;

-- Create security policies
CREATE POLICY "Users can view their own data"
    ON users FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can view their own diagnostic tests"
    ON diagnostic_tests FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own study plans"
    ON study_plans FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own progress"
    ON subject_progress FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Public read access to questions"
    ON questions FOR SELECT
    TO authenticated
    USING (true);
