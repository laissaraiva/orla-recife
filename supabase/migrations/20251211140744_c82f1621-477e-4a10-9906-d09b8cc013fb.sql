-- Create enum for news category
CREATE TYPE public.news_category AS ENUM ('alert', 'news', 'weather');

-- Create news table
CREATE TABLE public.news (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  category news_category NOT NULL DEFAULT 'news',
  image_url TEXT,
  published_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;

-- News are publicly readable
CREATE POLICY "News are viewable by everyone" 
ON public.news 
FOR SELECT 
USING (true);

-- Create trigger for updated_at
CREATE TRIGGER update_news_updated_at
BEFORE UPDATE ON public.news
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for news table
ALTER PUBLICATION supabase_realtime ADD TABLE public.news;