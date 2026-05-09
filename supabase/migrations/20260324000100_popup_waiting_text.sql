-- Add editable text fields for "Waiting for Registration" modal state
ALTER TABLE popup_settings
ADD COLUMN IF NOT EXISTS waiting_title TEXT NOT NULL DEFAULT 'Waiting for Registration',
ADD COLUMN IF NOT EXISTS waiting_description TEXT NOT NULL DEFAULT 'Please complete your free registration in the new window. Once you finish, you''ll have full access to all premium videos.',
ADD COLUMN IF NOT EXISTS waiting_button_text TEXT NOT NULL DEFAULT 'Open Link Again';
