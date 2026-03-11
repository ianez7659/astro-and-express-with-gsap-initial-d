const { createClient } = require("@supabase/supabase-js");

// Supabase Client initialization with environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn("Supabase credentials not found. Using fallback mode.");
  console.warn("SUPABASE_URL:", supabaseUrl ? "✓ Set" : "✗ Missing");
  console.warn("SUPABASE_ANON_KEY:", supabaseKey ? "✓ Set" : "✗ Missing");
} else {
  console.log("Supabase client initialized successfully");
}

const supabase =
  supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

module.exports = supabase;
