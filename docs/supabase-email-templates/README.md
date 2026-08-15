# Supabase Email Templates

The committed copy of the HTML that Supabase Auth sends to users. The dashboard
is still the thing that actually stores these, but nothing here is authored in
the dashboard — edit the files, merge to `main`, and the `supabase-email`
workflow pushes them to the hosted project.

## Layout

| File | Purpose |
| --- | --- |
| `templates/*.html` | The email bodies, one per Supabase template |
| `manifest.json` | Maps each template to its subject line and its Management API field names |
| `sync.mjs` | Pushes the templates to a hosted project (or reports drift) |
| `preview.mjs` | Renders every template on one page with sample values |

## The templates

Six of these are transactional emails triggered by an auth flow. The other seven
are security notifications Supabase sends after the fact — they have no call to
action and are styled in amber rather than blue.

| Template | File | Sent when |
| --- | --- | --- |
| Confirm sign up | `templates/confirmation.html` | A new account needs its email verified |
| Invite user | `templates/invite.html` | An existing user invites someone |
| Magic link or OTP | `templates/magic-link.html` | Passwordless sign-in is requested |
| Change email address | `templates/email-change.html` | A user changes their email and the new address must be verified |
| Reset password | `templates/recovery.html` | A password reset is requested |
| Reauthentication | `templates/reauthentication.html` | A sensitive operation needs identity reconfirmed |
| Password changed | `templates/notification-password-changed.html` | After a password change |
| Email address changed | `templates/notification-email-changed.html` | After an email change |
| Phone number changed | `templates/notification-phone-changed.html` | After a phone change |
| Sign-in method linked | `templates/notification-identity-linked.html` | After an OAuth identity is linked |
| Sign-in method removed | `templates/notification-identity-unlinked.html` | After an OAuth identity is unlinked |
| MFA method added | `templates/notification-mfa-factor-enrolled.html` | After an MFA factor is enrolled |
| MFA method removed | `templates/notification-mfa-factor-unenrolled.html` | After an MFA factor is unenrolled |

## Template variables

Supabase renders these with Go templates. Only the variables listed for a given
template are populated — anything else comes out empty.

| Template | Available variables |
| --- | --- |
| Confirm sign up, Invite user, Magic link, Reset password | `.ConfirmationURL` `.Token` `.TokenHash` `.SiteURL` `.RedirectTo` `.Data` `.Email` |
| Change email address | `.ConfirmationURL` `.Token` `.TokenHash` `.SiteURL` `.RedirectTo` `.Data` `.Email` `.NewEmail` |
| Reauthentication | `.Token` `.SiteURL` `.Data` |
| Password changed | `.Email` `.Data` |
| Email address changed | `.OldEmail` `.Email` `.Data` |
| Phone number changed | `.OldPhone` `.Phone` `.Data` |
| Sign-in method linked / removed | `.Provider` `.Email` `.Data` |
| MFA method added / removed | `.FactorType` `.Data` |

The security notifications do not get `.SiteURL`, so the links in those files
hard-code `https://kennerspiel.com`.

Rather than `{{ .ConfirmationURL }}`, the transactional templates build their own
link against `/account/confirm`, which is the app's own
[verification route](../../web/src/app/account/confirm/route.ts):

```
{{ .SiteURL }}/account/confirm?token_hash={{ .TokenHash }}&type=<type>
```

`type` is the Supabase OTP type — `email`, `invite`, `magiclink`, `recovery`, or
`email_change`. An optional `next` parameter picks the landing page; the reset
email uses `next=/account/changePassword` so the user arrives where they can
actually set a new code.

## Previewing a change

```sh
node docs/supabase-email-templates/preview.mjs > preview.html && open preview.html
```

Sample values are substituted for the template variables, so this shows layout
and copy, not exactly what the mailer emits.

## Syncing to the hosted project

`.github/workflows/supabase-email.yml` runs `sync.mjs` on every push to `main`
that touches this directory, and on manual dispatch. The script `GET`s the
project's auth config, compares only the mailer fields named in `manifest.json`,
and `PATCH`es back the ones that differ. Every other auth setting — site URL,
redirect allow-list, providers — is left untouched, so this cannot clobber
dashboard configuration the way a full `supabase config push` would.

It needs two things in repository settings:

- `SUPABASE_ACCESS_TOKEN` (secret) — a personal access token from
  <https://supabase.com/dashboard/account/tokens>
- `SUPABASE_PROJECT_REF` (variable) — the project ref from the project's URL

To run it by hand:

```sh
export SUPABASE_ACCESS_TOKEN=sbp_...
export SUPABASE_PROJECT_REF=...

node docs/supabase-email-templates/sync.mjs --check   # report drift, change nothing
node docs/supabase-email-templates/sync.mjs           # push whatever differs
```

`--check` exits non-zero when the project has drifted from what is committed,
which is the thing to run if someone has been editing in the dashboard.

### Enabling the notification emails

Pushing a notification template does not turn it on. The seven security
notifications are each gated behind a separate flag
(`mailer_notifications_password_changed_enabled` and friends), which `sync.mjs`
deliberately leaves alone — turning them on starts sending mail, and that should
be a deliberate click rather than a side effect of editing HTML. Enable them
under **Authentication → Emails** in the dashboard.

## Local development

`supabase/config.toml` is not wired to these files. The local stack captures mail
in Inbucket on port 54324 and renders the default templates. To exercise these
ones locally, point the config at them:

```toml
[auth.email.template.confirmation]
subject = "Confirm your capsuleer registration"
content_path = "./docs/supabase-email-templates/templates/confirmation.html"
```

`content_path` is resolved relative to the directory `supabase` runs from, so
this assumes the repository root.
