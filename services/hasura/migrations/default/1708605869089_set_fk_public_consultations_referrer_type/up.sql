-- First, drop the existing constraint if it exists
ALTER TABLE public.consultations
DROP CONSTRAINT IF EXISTS "fk_consultations_referrer";

-- Then, add the foreign key constraint
ALTER TABLE public.consultations
ADD CONSTRAINT "fk_consultations_referrer"
FOREIGN KEY ("referrer")
REFERENCES public.referrer_types(referrer_type);
