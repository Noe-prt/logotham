DO $$
BEGIN
    ALTER TABLE "subscriptions"
    ADD COLUMN "cancel_at_period_end" boolean DEFAULT false;
EXCEPTION
    WHEN duplicate_column THEN NULL;
END $$;
