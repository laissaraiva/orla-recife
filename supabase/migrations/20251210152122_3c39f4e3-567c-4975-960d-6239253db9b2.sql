-- Create enum for beach status
CREATE TYPE public.beach_status AS ENUM ('safe', 'warning', 'danger');

-- Create enum for coliform level
CREATE TYPE public.coliform_level AS ENUM ('normal', 'elevated', 'high');

-- Create enum for shark risk
CREATE TYPE public.shark_risk AS ENUM ('low', 'medium', 'high');

-- Create beaches table
CREATE TABLE public.beaches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  neighborhood TEXT NOT NULL,
  status beach_status NOT NULL DEFAULT 'safe',
  last_update TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  coordinates_lat DECIMAL(10, 6) NOT NULL,
  coordinates_lng DECIMAL(10, 6) NOT NULL,
  description TEXT,
  amenities TEXT[] DEFAULT '{}',
  wave_height DECIMAL(3, 1) DEFAULT 0,
  shark_risk shark_risk DEFAULT 'low',
  water_temperature DECIMAL(4, 1) DEFAULT 25,
  coliform_level coliform_level DEFAULT 'normal',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.beaches ENABLE ROW LEVEL SECURITY;

-- Beaches are publicly readable
CREATE POLICY "Beaches are viewable by everyone" 
ON public.beaches 
FOR SELECT 
USING (true);

-- Only admins can modify beaches (for now, using service role)
CREATE POLICY "Service role can modify beaches" 
ON public.beaches 
FOR ALL 
USING (auth.role() = 'service_role');

-- Create trigger for updated_at
CREATE TRIGGER update_beaches_updated_at
BEFORE UPDATE ON public.beaches
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create notification log table
CREATE TABLE public.beach_status_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  beach_id UUID REFERENCES public.beaches(id) ON DELETE CASCADE NOT NULL,
  old_status beach_status NOT NULL,
  new_status beach_status NOT NULL,
  notified_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on notifications
ALTER TABLE public.beach_status_notifications ENABLE ROW LEVEL SECURITY;

-- Notifications are publicly readable
CREATE POLICY "Notifications are viewable by everyone" 
ON public.beach_status_notifications 
FOR SELECT 
USING (true);

-- Function to log status changes
CREATE OR REPLACE FUNCTION public.log_beach_status_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.beach_status_notifications (beach_id, old_status, new_status)
    VALUES (NEW.id, OLD.status, NEW.status);
    
    NEW.last_update = now();
  END IF;
  RETURN NEW;
END;
$$;

-- Trigger for status change logging
CREATE TRIGGER on_beach_status_change
BEFORE UPDATE ON public.beaches
FOR EACH ROW
EXECUTE FUNCTION public.log_beach_status_change();

-- Enable realtime for beaches table
ALTER PUBLICATION supabase_realtime ADD TABLE public.beaches;
ALTER PUBLICATION supabase_realtime ADD TABLE public.beach_status_notifications;