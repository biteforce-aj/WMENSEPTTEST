import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import axios from 'axios';
import fs from 'fs';
import crypto from 'crypto';
import cron from 'node-cron';


const supabase = createClient(
   process.env.SUPABASE_URL,
   process.env.SUPABASE_SERVICE_KEY
);


const mailchimpInstance = axios.create({
   baseURL: `https://${process.env.MAILCHIMP_SERVER_PREFIX}.api.mailchimp.com/3.0`,
   auth: {
       username: 'anystring',
       password: process.env.MAILCHIMP_API_KEY,
   },
});


const SYNC_TRACK_FILE = '.last_synced.json';


// Validate environment variables
const requiredEnvVars = ['SUPABASE_URL', 'SUPABASE_SERVICE_KEY', 'MAILCHIMP_API_KEY', 'MAILCHIMP_SERVER_PREFIX', 'MAILCHIMP_LIST_ID'];
for (const envVar of requiredEnvVars) {
   if (!process.env[envVar]) {
       console.error(`❌ Missing environment variable: ${envVar}`);
       process.exit(1);
   }
}


function getLastSyncTime() {
   try {
       if (!fs.existsSync(SYNC_TRACK_FILE)) return null;
       const content = fs.readFileSync(SYNC_TRACK_FILE, 'utf-8');
       return JSON.parse(content)?.last_synced_at;
   } catch (err) {
       console.error(`❌ Error reading ${SYNC_TRACK_FILE}:`, err.message);
       return null;
   }
}


function updateLastSyncTime() {
   try {
       const now = new Date().toISOString();
       fs.writeFileSync(SYNC_TRACK_FILE, JSON.stringify({ last_synced_at: now }, null, 2));
       return now;
   } catch (err) {
       console.error(`❌ Error writing ${SYNC_TRACK_FILE}:`, err.message);
       throw err;
   }
}


async function syncNewsletter() {
   try {
       const lastSyncedAt = getLastSyncTime();
       console.log('⏱ Last sync:', lastSyncedAt || 'Never');


       const { data: subscribers, error } = await supabase
           .from('newsletter_subscribers')
           .select('*')
           .gt('created_at', lastSyncedAt || '1970-01-01T00:00:00.000Z');


       if (error) {
           console.error('❌ Supabase query error:', error.message);
           throw error;
       }


       console.log('📦 New Supabase signups:', subscribers.length);


       for (const subscriber of subscribers) {
           const email = subscriber.email.toLowerCase();
           const hash = crypto.createHash('md5').update(email).digest('hex');


           try {
               await mailchimpInstance.get(`/lists/${process.env.MAILCHIMP_LIST_ID}/members/${hash}`);
               console.log(`⚠️ ${subscriber.email} already exists in Mailchimp.`);
               continue;
           } catch (err) {
               if (err.response?.status !== 404) {
                   console.error(`❌ Check failed for ${subscriber.email}:`, err.response?.data || err.message);
                   continue;
               }
           }


           try {
               const response = await mailchimpInstance.post(`/lists/${process.env.MAILCHIMP_LIST_ID}/members`, {
                   email_address: subscriber.email,
                   status: 'subscribed',
                   merge_fields: {
                       FNAME: subscriber.first_name || '',
                       LNAME: subscriber.last_name || '',
                   },
               });


               if (response.status === 200) {
                   console.log(`✅ Synced to Mailchimp: ${subscriber.email}`);
               }
           } catch (addErr) {
               console.error(`❌ Error syncing ${subscriber.email}:`, addErr.response?.data || addErr.message);
           }
       }


       const { data: allInSupabase, error: supabaseError } = await supabase
           .from('newsletter_subscribers')
           .select('email');


       if (supabaseError) {
           console.error('❌ Supabase fetch all error:', supabaseError.message);
           throw supabaseError;
       }


       const supabaseEmails = allInSupabase.map((s) => s.email.toLowerCase());


       const mailchimpMembers = await mailchimpInstance.get(`/lists/${process.env.MAILCHIMP_LIST_ID}/members?count=1000`);
       for (const member of mailchimpMembers.data.members) {
           const email = member.email_address.toLowerCase();
           if (!supabaseEmails.includes(email)) {
               const hash = crypto.createHash('md5').update(email).digest('hex');


               try {
                   await mailchimpInstance.patch(`/lists/${process.env.MAILCHIMP_LIST_ID}/members/${hash}`, {
                       status: 'unsubscribed',
                   });
                   console.log(`❌ Unsubscribed from Mailchimp: ${email}`);
               } catch (unsubscribeErr) {
                   console.error(`❌ Failed to unsubscribe ${email}:`, unsubscribeErr.response?.data || unsubscribeErr.message);
               }
           }
       }


       const syncTime = updateLastSyncTime();
       console.log(`🎉 Sync complete at ${syncTime}!`);
   } catch (err) {
       console.error('❌ Sync failed:', err.message);
       process.exit(1); // Explicit exit code for GitHub Actions
   }
}


// Run immediately if not in a cron-scheduled environment
if (process.env.GITHUB_ACTIONS !== 'true') {
   cron.schedule('* * * * *', () => {
       console.log('🔁 Running hourly newsletter sync...');
       syncNewsletter();
   });
}


// Run once for GitHub Actions
syncNewsletter();

