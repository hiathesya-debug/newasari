
-- Enums
CREATE TYPE public.app_role AS ENUM ('admin', 'staff', 'customer');
CREATE TYPE public.review_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE public.order_status AS ENUM ('Pending', 'Dikonfirmasi', 'Diproses', 'Siap', 'Selesai', 'Dibatalkan');

-- Profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL DEFAULT '',
  whatsapp TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX profiles_whatsapp_idx ON public.profiles(whatsapp) WHERE whatsapp IS NOT NULL;
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- User roles
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- has_role security-definer function
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE OR REPLACE FUNCTION public.is_staff_or_admin(_user_id UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role IN ('admin','staff')
  )
$$;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT TO authenticated
  USING (auth.uid() = id OR public.is_staff_or_admin(auth.uid()));
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- User roles policies
CREATE POLICY "Users can view own roles" ON public.user_roles
  FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_staff_or_admin(auth.uid()));

-- Auto-create profile + customer role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, whatsapp)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.raw_user_meta_data->>'whatsapp'
  );
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'customer');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Reviews
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  is_anonymous BOOLEAN NOT NULL DEFAULT FALSE,
  product_id TEXT,
  product_name TEXT,
  review_text TEXT NOT NULL CHECK (char_length(review_text) >= 10 AND char_length(review_text) <= 500),
  status public.review_status NOT NULL DEFAULT 'pending',
  submitter_ip TEXT,
  customer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMPTZ
);
CREATE INDEX reviews_status_idx ON public.reviews(status);
CREATE INDEX reviews_created_idx ON public.reviews(created_at DESC);
GRANT SELECT ON public.reviews TO anon, authenticated;
GRANT INSERT ON public.reviews TO anon, authenticated;
GRANT UPDATE, DELETE ON public.reviews TO authenticated;
GRANT ALL ON public.reviews TO service_role;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view approved reviews" ON public.reviews
  FOR SELECT TO anon, authenticated USING (status = 'approved');
CREATE POLICY "Staff can view all reviews" ON public.reviews
  FOR SELECT TO authenticated USING (public.is_staff_or_admin(auth.uid()));
CREATE POLICY "Anyone can submit reviews" ON public.reviews
  FOR INSERT TO anon, authenticated WITH CHECK (status = 'pending');
CREATE POLICY "Staff can update reviews" ON public.reviews
  FOR UPDATE TO authenticated USING (public.is_staff_or_admin(auth.uid()));
CREATE POLICY "Staff can delete reviews" ON public.reviews
  FOR DELETE TO authenticated USING (public.is_staff_or_admin(auth.uid()));

-- Orders
CREATE TABLE public.orders (
  id TEXT PRIMARY KEY,
  customer_name TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  product_id TEXT,
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  paper_bag INTEGER NOT NULL DEFAULT 0,
  method TEXT NOT NULL,
  address TEXT,
  pickup_date TEXT NOT NULL,
  pickup_time TEXT NOT NULL,
  total INTEGER NOT NULL DEFAULT 0,
  status public.order_status NOT NULL DEFAULT 'Pending',
  source TEXT NOT NULL DEFAULT 'WhatsApp',
  notes TEXT,
  customer_note TEXT,
  customer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX orders_whatsapp_idx ON public.orders(whatsapp);
CREATE INDEX orders_customer_idx ON public.orders(customer_id);
CREATE INDEX orders_created_idx ON public.orders(created_at DESC);
GRANT SELECT ON public.orders TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customers see own orders" ON public.orders
  FOR SELECT TO authenticated
  USING (customer_id = auth.uid() OR public.is_staff_or_admin(auth.uid()));
CREATE POLICY "Staff manage orders" ON public.orders
  FOR ALL TO authenticated
  USING (public.is_staff_or_admin(auth.uid()))
  WITH CHECK (public.is_staff_or_admin(auth.uid()));

-- Normalize WA: digits only
CREATE OR REPLACE FUNCTION public.normalize_wa(_wa TEXT)
RETURNS TEXT LANGUAGE sql IMMUTABLE AS $$
  SELECT regexp_replace(COALESCE(_wa,''), '\D', '', 'g')
$$;

-- Auto-link orders to a registered customer when WA matches
CREATE OR REPLACE FUNCTION public.link_order_to_customer()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE matched UUID;
BEGIN
  IF NEW.customer_id IS NULL AND NEW.whatsapp IS NOT NULL THEN
    SELECT id INTO matched FROM public.profiles
      WHERE public.normalize_wa(whatsapp) = public.normalize_wa(NEW.whatsapp)
      LIMIT 1;
    NEW.customer_id := matched;
  END IF;
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER orders_link_customer
  BEFORE INSERT OR UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.link_order_to_customer();

-- Backfill orders when a new profile is created (so signup connects existing orders)
CREATE OR REPLACE FUNCTION public.backfill_orders_for_profile()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.whatsapp IS NOT NULL THEN
    UPDATE public.orders SET customer_id = NEW.id
      WHERE customer_id IS NULL
        AND public.normalize_wa(whatsapp) = public.normalize_wa(NEW.whatsapp);
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER profiles_backfill_orders
  AFTER INSERT OR UPDATE OF whatsapp ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.backfill_orders_for_profile();
