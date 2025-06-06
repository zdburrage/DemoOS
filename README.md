<p align="center">
    <h1 align="center">Demo OS</h1>
    <p align="center"> 
        <img style="width: 30%; height: 30%;"   src="http://demo-os.vercel.app/favicon.ico">
    </p>
    <p align="center">A Standard Demo App Template for showcasing WorkOS's key features</p>    
    <p align="center"><a href="https://workos.com/docs">Explore the WorkOS docs ↗</a></strong></p>    
</p>

## Examples

This repository has examples of the following:
- [SSO](./src/app/using-your-own-ui/sign-in/sso/):
  Initiate SSO with an organization ID or connection ID
- [Using AuthKit's hosted UI](./src/app/using-hosted-authkit):
  This is the fastest way to add authentication to your app with AuthKit and WorkOS User Management. It includes a fully themeable hosted UI that handles all of your authentication flows. When you're ready to go to production you can point it to a custom domain (`auth.yourapp.com`) to match your application. Flows are pre-built for:
    * Basic Redirect Flow Without Session
    * Using Next.js AuthKit Library for Sessions
    * Creating Sessions Using the WorkOS API
    * See [this readme](/src//app/using-hosted-authkit/README.md) for more setup information if you want to create sessions

- [Using your own custom UI](./src/app/using-your-own-ui):
  Use all of the features of AuthKit, but build out the UI yourself in your own codebase by integrating directly with the headless WorkOS User Management APIs. Your authentication UI will be self-hosted in your application. Flows are pre-built for:
    * Sign Up (Email/Password)
    * Sign In (Email/Password + Magic Link)
    * Social Authentication (Microsoft, Google, GitHub)
    * Enterprise SSO (Depends on Configuring an SSO connection for an Organization)
    * MFA (Authenticator App + SMS)
    * Email Verification
    * User Updates
    * User Table Views
- [Creating new WorkOS Organizations and Generating Admin Portal Links](./src/app/admin-portal/):
  This shows and examples of how developers can add admin portal functionality into their application instead of generating links themselves from the WorkOS dashboard
- [MFA Enrollment and Verification](./src/app/using-your-own-ui/mfa/):
  Shows an example of how to perform in-app MFA using TOTP/QR Code or SMS
- [Widgets](./src/app/using-hosted-authkit/with-nextjs/page.tsx): An example of our User Management widget for customer delegated administration of users per organization

## Prerequisites

- You will need a [WorkOS account](https://dashboard.workos.com/signup).
- For demonstrating SSO, you'll want to set up an IDP directory such as [Okta](https://www.okta.com/free-trial/?utm_source=google&utm_campaign=amer_mult_usa_all_wf-all_dg-ao_a-wf_search_google_text_kw_brand-general-T2_utm2&utm_medium=cpc&utm_id=aNK4z000000UAtkGAG&gad_source=1&gclid=CjwKCAiAnKi8BhB0EiwA58DA4S2Up5WdklHxwNYrQXC-ofKMpTQacTdpDOhwzTb8c5k2JL0Wq_MPXBoCawAQAvD_BwE), [Microsoft Entra](https://www.microsoft.com/en-us/security/business/microsoft-entra), [Google Workspace](https://workspace.google.com/lp/business/?utm_source=google&utm_medium=cpc&utm_campaign=na-US-all-en-dr-bkws-all-all-trial-e-dr-1710046&utm_content=text-ad-none-any-DEV_c-CRE_658969970598-ADGP_Hybrid+%7C+BKWS+-+EXA+%7C+Txt-Google+Workspace-Core-KWID_43700076501879769-kwd-346911454270&utm_term=KW_google%20workspace-ST_google+workspace&gad_source=1&gclid=CjwKCAiAnKi8BhB0EiwA58DA4e5venkHwPJPypyFwFoF4cZZq_vabsFT3EUA5R88whC7hmmoJkk8IxoCikYQAvD_BwE&gclsrc=aw.ds) etc. Reach out to someone on the SE or Security team to be added to a Sandbox Tenant of one of these IDPs if you don't already have one/don't want to create your own.


## Running the example

1. Install dependencies with `npm install` or `yarn install`
2. Set up your **Environment variables** by signing into your [WorkOS dashboard](https://dashboard.workos.com), navigate to **API Keys** and copy the **Client ID** and the **Secret Key** (API Key).
   Create a file named the `.env.local` and supply your _Client ID_ and _Secret Key_. Do this for any other environment files you'd wish to switch between.

   ```bash
   WORKOS_CLIENT_ID="<your Client ID>"
   WORKOS_API_KEY="<your Secret Key>"
   SSO_ENABLED_ORGANIZATION_ID="<Organization ID of org you would like to demonstrate SSO with (optional)>"
   ```

3. Configure redirects in your [WorkOS dashboard](https://dashboard.workos.com), navigate to **Redirects** and add the following urls:

   ```bash
   http://localhost:3000/using-your-own-ui/sign-in/google-oauth/callback
   ```

   ```bash
   http://localhost:3000/using-your-own-ui/sign-in/microsoft-oauth/callback
   ```

   ```bash
   http://localhost:3000/using-your-own-ui/sign-in/github-oauth/callback
   ```

   ```bash
   http://localhost:3000/using-your-own-ui/sign-in/sso/callback
   ```

   ```bash
   http://localhost:3000/using-hosted-authkit/basic/callback
   ```

   ```bash
   http://localhost:3000/using-hosted-authkit/with-session/callback
   ```

   ```bash
   http://localhost:3000/using-hosted-authkit/with-nextjs/callback
   ```

4. Run the example with `npm run dev` or `yarn dev` and navigate to http://localhost:3000
5. Once you get familiar with some of the flows, [brand your Authkit hosted page](https://workos.com/docs/user-management/branding)

## Dashboard API Example

Calling `/api/dashboard` returns metrics and a small sample of recent authentication events. Example response:

```json
{
  "metrics": {
    "totalUsers": 42,
    "totalOrgs": 7,
    "authEvents": 5
  },
  "recentActivity": [
    {
      "user": "user_01ABCD",
      "action": "authentication.sso_succeeded",
      "time": "2024-05-01T12:30:00.000Z"
    }
  ]
}
```
