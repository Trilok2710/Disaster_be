require('dotenv').config();

const { createClient } = require('@supabase/supabase-js');
// const { supabaseUrl, supabaseAnonKey } = require('./config');
const supabaseUrl = "https://dvsxldaifmauvxhqtbrp.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR2c3hsZGFpZm1hdXZ4aHF0YnJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAzNTg0ODIsImV4cCI6MjA2NTkzNDQ4Mn0.CU2V2dIo1LhNnhKALDP0CW29TWaSiPa1b11PHm2l0Gw";
console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Anon Key:', supabaseAnonKey ? 'Present' : 'Missing');

const supabase = createClient(supabaseUrl, supabaseAnonKey);

module.exports = supabase; 