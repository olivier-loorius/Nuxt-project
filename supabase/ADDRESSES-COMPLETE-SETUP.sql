-- =====================================================
-- COMPLETE ADDRESSES TABLE SETUP
-- Replicate profiles structure with address-specific columns
-- =====================================================

-- Step 1: DROP existing table if exists
DROP TABLE IF EXISTS public.addresses CASCADE;

-- Step 2: CREATE addresses table (structure based on profiles)
CREATE TABLE IF NOT EXISTS public.addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Address fields
  type TEXT NOT NULL DEFAULT 'home',
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  postal_code TEXT NOT NULL,
  city TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'France',
  phone TEXT,
  is_default BOOLEAN DEFAULT false,

  -- Metadata (matching profiles structure)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,

  -- Constraints (matching profiles phone constraint)
  CONSTRAINT phone_format CHECK (phone IS NULL OR phone ~* '^\+?[0-9\s]{6,20}$')
);

-- Step 3: CREATE INDEXES (matching profiles performance)
CREATE INDEX IF NOT EXISTS idx_addresses_user_id ON public.addresses(user_id);
CREATE INDEX IF NOT EXISTS idx_addresses_created_at ON public.addresses(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_addresses_is_default ON public.addresses(user_id, is_default);

-- Step 4: ENABLE ROW LEVEL SECURITY
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;

-- Step 5: CREATE RLS POLICIES (copied from profiles)
-- Policy 1: Users can view own addresses
CREATE POLICY "Users can view own addresses"
  ON public.addresses
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy 2: Service role can insert addresses (via trigger)
CREATE POLICY "Service role can insert addresses"
  ON public.addresses
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Policy 3: Authenticated users can insert own addresses
CREATE POLICY "Authenticated users can insert own addresses"
  ON public.addresses
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy 4: Users can update own addresses
CREATE POLICY "Users can update own addresses"
  ON public.addresses
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy 5: Users can delete own addresses
CREATE POLICY "Users can delete own addresses"
  ON public.addresses
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy 6: Service role can delete addresses
CREATE POLICY "Service role can delete addresses"
  ON public.addresses
  FOR DELETE
  TO service_role
  USING (true);

-- Step 6: CREATE TRIGGER for updated_at (matching profiles)
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_addresses_updated ON public.addresses;
CREATE TRIGGER on_addresses_updated
  BEFORE UPDATE ON public.addresses
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Step 7: GRANT STATEMENTS
-- Grant authenticated users basic access (RLS will enforce row-level restrictions)
GRANT SELECT, INSERT, UPDATE, DELETE ON public.addresses TO authenticated;

-- Grant service_role full access
GRANT ALL PRIVILEGES ON public.addresses TO service_role;

-- Grant anon no access (default, explicitly stated)
REVOKE ALL ON public.addresses FROM anon;

-- =====================================================
-- VERIFICATION QUERIES (run these to verify setup)
-- =====================================================
-- SELECT table_name FROM information_schema.tables WHERE table_name = 'addresses';
-- SELECT * FROM pg_indexes WHERE tablename = 'addresses';
-- SELECT schemaname, tablename, rowsecurity FROM pg_tables WHERE tablename = 'addresses';
-- SELECT policyname, permissive, roles, qual, with_check FROM pg_policies WHERE tablename = 'addresses';
