// supabaseClient.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://fbcequeftvgcysbrjuma.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZiY2VxdWVmdHZnY3lzYnJqdW1hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwOTQwNzcsImV4cCI6MjA2ODY3MDA3N30.oGrYI1pG5Pygtb-jnMq_vgULJtS72aeZ1r7YvIDoTLI'; // use anon key, not service role

export const supabase = createClient(supabaseUrl, supabaseKey);
