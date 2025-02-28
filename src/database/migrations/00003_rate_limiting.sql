-- Create rate limiting table
CREATE TABLE rate_limits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    identifier TEXT NOT NULL,
    hits INTEGER DEFAULT 1,
    last_hit TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    reset_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP + INTERVAL '10 seconds',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(identifier)
);

-- Create index for faster lookups
CREATE INDEX idx_rate_limits_identifier ON rate_limits(identifier);

-- Function to cleanup old rate limit records
CREATE OR REPLACE FUNCTION cleanup_rate_limits()
RETURNS void AS $$
BEGIN
    DELETE FROM rate_limits
    WHERE reset_at < CURRENT_TIMESTAMP;
END;
$$ LANGUAGE plpgsql;

-- Function to check and update rate limits
CREATE OR REPLACE FUNCTION check_rate_limit(
    p_identifier TEXT,
    p_max_hits INTEGER DEFAULT 10,
    p_window_seconds INTEGER DEFAULT 10
)
RETURNS TABLE (
    allowed BOOLEAN,
    remaining INTEGER,
    reset_at TIMESTAMP WITH TIME ZONE
) AS $$
DECLARE
    v_now TIMESTAMP WITH TIME ZONE := CURRENT_TIMESTAMP;
    v_record rate_limits%ROWTYPE;
BEGIN
    -- Cleanup old records first
    PERFORM cleanup_rate_limits();

    -- Try to get existing record
    SELECT * INTO v_record
    FROM rate_limits
    WHERE identifier = p_identifier
    FOR UPDATE SKIP LOCKED;

    IF v_record.id IS NULL THEN
        -- First request for this identifier
        INSERT INTO rate_limits (
            identifier,
            hits,
            last_hit,
            reset_at
        )
        VALUES (
            p_identifier,
            1,
            v_now,
            v_now + (p_window_seconds || ' seconds')::INTERVAL
        )
        RETURNING * INTO v_record;

        RETURN QUERY
        SELECT
            TRUE as allowed,
            (p_max_hits - 1) as remaining,
            v_record.reset_at;
    ELSE
        IF v_record.reset_at <= v_now THEN
            -- Window expired, reset counter
            UPDATE rate_limits
            SET
                hits = 1,
                last_hit = v_now,
                reset_at = v_now + (p_window_seconds || ' seconds')::INTERVAL
            WHERE id = v_record.id
            RETURNING * INTO v_record;

            RETURN QUERY
            SELECT
                TRUE as allowed,
                (p_max_hits - 1) as remaining,
                v_record.reset_at;
        ELSE
            -- Check if limit exceeded
            IF v_record.hits >= p_max_hits THEN
                RETURN QUERY
                SELECT
                    FALSE as allowed,
                    0 as remaining,
                    v_record.reset_at;
            ELSE
                -- Increment hits
                UPDATE rate_limits
                SET
                    hits = hits + 1,
                    last_hit = v_now
                WHERE id = v_record.id
                RETURNING * INTO v_record;

                RETURN QUERY
                SELECT
                    TRUE as allowed,
                    (p_max_hits - v_record.hits) as remaining,
                    v_record.reset_at;
            END IF;
        END IF;
    END IF;
END;
$$ LANGUAGE plpgsql;
