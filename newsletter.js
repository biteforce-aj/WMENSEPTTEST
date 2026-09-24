// Import the Supabase client
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// Supabase config
const supabaseUrl = 'https://mahbtpgkltnqevzqzhas.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1haGJ0cGdrbHRucWV2enF6aGFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg3ODIwODEsImV4cCI6MjA2NDM1ODA4MX0.PMotG2m9HEAXwAwTWioQ-upfrpB2dKeg_CofLFM4yxw';
const supabase = createClient(supabaseUrl, supabaseKey);

// Form submission handler
const form = document.getElementById('newsletter-form');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const firstName = document.getElementById('first-name').value.trim();
    const lastName = document.getElementById('last-name').value.trim();
    const email = document.getElementById('email').value.trim();

    if (!firstName || !lastName || !email) {
        alert('Please fill in all fields');
        return;
    }

    // Insert into Supabase
    const { data, error } = await supabase
        .from('newsletter_subscribers')
        .insert([
            {
                first_name: firstName,
                last_name: lastName,
                email: email,
            }
        ]);

    if (error) {
        console.error(error);
        alert('Something went wrong. Please try again later.');
    } else {
        alert('Thanks for subscribing!');
        form.reset();
        document.getElementById('newsletter-popup').style.display = 'none';
    }
});
