-- Add updated_by_email column to predictions table
alter table public.predictions
add column if not exists updated_by_email text;

-- Create index for better query performance
create index if not exists idx_predictions_updated_by_email on public.predictions (updated_by_email);

-- Update existing records to populate updated_by_email with a placeholder
-- (will be updated when users save their predictions)
update public.predictions
set updated_by_email = null
where updated_by_email is null;
