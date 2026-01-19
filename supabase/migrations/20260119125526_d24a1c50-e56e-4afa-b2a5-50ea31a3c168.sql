-- MIGRATION 1: Add new enum values only
-- These need to be committed before they can be used in functions

DO $$ 
BEGIN
    -- Add 'operational' role if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'operational' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'app_role')) THEN
        ALTER TYPE public.app_role ADD VALUE 'operational';
    END IF;
END $$;

DO $$ 
BEGIN
    -- Add 'executive' role if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'executive' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'app_role')) THEN
        ALTER TYPE public.app_role ADD VALUE 'executive';
    END IF;
END $$;