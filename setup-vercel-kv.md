# Setting Up Vercel KV Database for Your Portfolio

To make your admin dashboard work correctly on Vercel, you need to set up the Vercel KV (Key-Value) database. This is a simple, persistent database that will store your portfolio content.

## Steps to Set Up Vercel KV

1. **Log in to your Vercel Dashboard**
   - Go to [vercel.com](https://vercel.com/) and log in to your account

2. **Navigate to Your Project**
   - Find and click on your portfolio project in the dashboard

3. **Add Vercel KV Integration**
   - In the left sidebar, click on **Storage**
   - Find **KV Database** and click **Add**
   - Select **Create New** to create a new KV database
   - Give it a name like "portfolio-content"
   - Select a region close to your target audience
   - Click **Create & Link**

4. **Environment Variables**
   - Vercel will automatically add the necessary environment variables to your project
   - The two key variables are:
     - `VERCEL_KV_URL`
     - `VERCEL_KV_REST_TOKEN`

5. **Redeploy Your Application**
   - After setting up the KV database, you need to redeploy your application
   - Go to the **Deployments** tab
   - Click on the three dots (**...**) next to your latest deployment
   - Select **Redeploy**

## Troubleshooting

If your admin dashboard still isn't working after setting up Vercel KV, check the following:

1. **Verify Environment Variables**
   - In your Vercel project, go to **Settings** > **Environment Variables**
   - Confirm that both `VERCEL_KV_URL` and `VERCEL_KV_REST_TOKEN` are present
   - If they're missing, you may need to add them manually or reconnect the KV integration

2. **Check Logs**
   - In your Vercel project, go to **Deployments** > [latest deployment] > **Functions**
   - Click on any API route (like `/api/content/hero`)
   - Check the logs for any errors related to KV connection

3. **Initialize Data**
   - The first time you access your application after setting up KV, it will try to initialize the database
   - Visit the frontend of your website to trigger this initialization
   - Then try using the admin dashboard again

## Local Development vs. Production

- **Local Development**: When running locally, your changes are saved to the `data/content.json` file
- **Production (Vercel)**: When running on Vercel, your changes are saved to the Vercel KV database

Once everything is set up correctly, changes made in the admin dashboard will persist across deployments and server restarts in production. 