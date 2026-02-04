import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  'https://psgfhddunztqsydbbbth.supabase.co', // ← paste your project URL
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzZ2ZoZGR1bnp0cXN5ZGJiYnRoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTIyMzgzNSwiZXhwIjoyMDY2Nzk5ODM1fQ.W2d_-H2KCbsLk6KmD6qH85AjhKCLY_Q4-iXNGaz0ofA'                 // ← paste service key (server only)
);
