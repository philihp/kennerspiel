CREATE OR REPLACE FUNCTION public.instance_broadcast_function() RETURNS trigger AS $$
BEGIN
  INSERT INTO realtime.messages (payload, event, topic, private, extension)
        VALUES (row_to_json(NEW.*), 'sync', 'instance:'||NEW.id::text, false, 'broadcast');
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER instance_broadcast_trigger
AFTER INSERT OR UPDATE OR DELETE ON public.instance
FOR EACH ROW
EXECUTE FUNCTION public.instance_broadcast_function ();
