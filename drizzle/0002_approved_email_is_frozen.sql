-- Once an email is approved, what sends is exactly what was approved.
-- Its subject, body, lead and approval can't change. To send different
-- text, write a new draft and approve it again.
CREATE FUNCTION email_message_freeze_approved() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  IF OLD.approval_id IS NOT NULL AND (
       NEW.subject IS DISTINCT FROM OLD.subject
    OR NEW.body IS DISTINCT FROM OLD.body
    OR NEW.lead_id IS DISTINCT FROM OLD.lead_id
    OR NEW.campaign_id IS DISTINCT FROM OLD.campaign_id
    OR NEW.approval_id IS DISTINCT FROM OLD.approval_id
  ) THEN
    RAISE EXCEPTION 'email % is approved and cannot be changed', OLD.id
      USING ERRCODE = 'check_violation';
  END IF;
  RETURN NEW;
END;
$$;
--> statement-breakpoint
CREATE TRIGGER email_message_freeze_approved
  BEFORE UPDATE ON email_message
  FOR EACH ROW EXECUTE FUNCTION email_message_freeze_approved();
--> statement-breakpoint
-- The approval ledger is append-only. Rows can be deleted only when their
-- workspace or campaign is deleted (cascade), never edited.
CREATE FUNCTION approval_append_only() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION 'approval records cannot be edited' USING ERRCODE = 'check_violation';
END;
$$;
--> statement-breakpoint
CREATE TRIGGER approval_append_only
  BEFORE UPDATE ON approval
  FOR EACH ROW EXECUTE FUNCTION approval_append_only();
