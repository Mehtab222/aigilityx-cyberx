import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface DeleteUserRequest {
  user_id: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase admin client with service role
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

    // Get the authorization header to verify the caller is an admin
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create a client with the user's token to verify they're an admin
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabaseUser = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    // Get the current user
    const { data: { user: callerUser }, error: userError } = await supabaseUser.auth.getUser();
    if (userError || !callerUser) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if the caller is an admin using the database function
    const { data: isAdmin, error: adminError } = await supabaseAdmin.rpc("is_admin", {
      _user_id: callerUser.id,
    });

    if (adminError || !isAdmin) {
      return new Response(
        JSON.stringify({ error: "Only admins can delete users" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse the request body
    const body: DeleteUserRequest = await req.json();
    const { user_id } = body;

    // Validate required fields
    if (!user_id) {
      return new Response(
        JSON.stringify({ error: "Missing required field: user_id" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Prevent self-deletion
    if (user_id === callerUser.id) {
      return new Response(
        JSON.stringify({ error: "You cannot delete your own account" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Delete the user's role first
    const { error: roleError } = await supabaseAdmin
      .from("user_roles")
      .delete()
      .eq("user_id", user_id);

    if (roleError) {
      console.error("Role deletion error:", roleError);
      // Continue with other deletions even if role doesn't exist
    }

    // Delete the user's profile
    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .delete()
      .eq("user_id", user_id);

    if (profileError) {
      console.error("Profile deletion error:", profileError);
      return new Response(
        JSON.stringify({ success: false, error: "Failed to delete user profile: " + profileError.message }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Delete the user from Supabase Auth
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(user_id);

    if (authError) {
      console.error("Auth deletion error:", authError);
      return new Response(
        JSON.stringify({ success: false, error: "Failed to delete auth user: " + authError.message }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "User deleted successfully" 
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
