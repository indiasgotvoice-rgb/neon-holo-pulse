const loadUserData = async (userId: string) => {
  try {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) {
      setLoading(false);
      return;
    }

    // First, try to get existing user from database
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (existingUser) {
      // User exists, use it
      setUser(existingUser);
      setLoading(false);
      return;
    }

    // User doesn't exist, try to create via Edge Function (for OAuth)
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-user-profile`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.session.access_token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const result = await response.json();

      if (result.user) {
        setUser(result.user);
        setLoading(false);
        return;
      }
    } catch (edgeFunctionError) {
      console.log('Edge function not available, creating user manually');
    }

    // If Edge Function fails or doesn't return a user, create manually
    // This handles email/password signups
    const authUser = session.session.user;
    
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert({
        id: userId,
        email: authUser.email!,
        google_id: authUser.user_metadata?.sub || null,
        is_admin: false,
      })
      .select()
      .single();

    if (insertError) {
      // If insert fails due to duplicate, try fetching again
      if (insertError.code === '23505') {
        const { data: retryUser } = await supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .single();
        
        if (retryUser) {
          setUser(retryUser);
        }
      } else {
        throw insertError;
      }
    } else {
      setUser(newUser);
    }
  } catch (error) {
    console.error('Error loading user:', error);
  } finally {
    setLoading(false);
  }
};
