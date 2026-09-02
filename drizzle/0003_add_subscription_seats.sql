DO $$
BEGIN
    ALTER TABLE "subscriptions"
    ADD COLUMN "seats" integer DEFAULT 1;
EXCEPTION
    WHEN duplicate_column THEN NULL;
END $$;
