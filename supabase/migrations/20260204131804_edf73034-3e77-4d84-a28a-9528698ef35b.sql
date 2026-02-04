-- Allow admins to update any user's profile
CREATE POLICY "Admin can update any profile"
ON public.profiles
FOR UPDATE
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

-- Allow admins to delete any user's profile  
CREATE POLICY "Admin can delete any profile"
ON public.profiles
FOR DELETE
USING (is_admin(auth.uid()));