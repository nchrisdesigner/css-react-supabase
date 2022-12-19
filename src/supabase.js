
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ectkkgotudkqqfivjnoc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVjdGtrZ290dWRrcXFmaXZqbm9jIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzExODE0MDcsImV4cCI6MTk4Njc1NzQwN30.MOOw1BNdqlKLWvVrzaR0SE53XP_vGPaBsciDgVI-GbE';
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;