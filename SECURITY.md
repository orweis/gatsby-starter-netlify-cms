# Security Policy

## Reporting a vulnerability

Please report vulnerabilities privately through GitHub's
[private vulnerability reporting](https://docs.github.com/en/code-security/security-advisories/guidance-on-reporting-and-writing-information-about-vulnerabilities/privately-reporting-a-security-vulnerability)
("Report a vulnerability" on the repository's **Security** tab). Please do not
open public issues for security problems.

## Supported versions

Only the latest release (currently 2.x) receives fixes. Version 1.x is based
on Gatsby 2 and Node 12, which are end-of-life, and will not be patched.

## Trust model

This is a static site. The main security boundary is **who can edit content**:

- Markdown is converted to HTML at build time and rendered as-is, including any
  raw HTML or `<script>` it contains. Anyone who can edit content through the
  CMS (Netlify Identity + Git Gateway) or commit to the repository can
  therefore run scripts on the published site.
- Git Gateway gives editors write access to the repository through Netlify's
  API, so treat CMS editors like repository collaborators.

Recommendations for sites built from this starter:

- In Netlify, set **Identity → Registration** to **Invite only** and invite
  only trusted editors. Open registration would let anyone publish content.
- Keep `sanitize_preview: true` on Markdown fields in
  `static/admin/config.yml` so that previewing untrusted content in the CMS
  does not run scripts in an editor's (authenticated) browser session.
- Protect the deploy branch on GitHub and review changes made by new editors.

## Headers

`gatsby-plugin-netlify` writes `public/_headers` with `X-Frame-Options: DENY`,
`X-Content-Type-Options: nosniff`, `Referrer-Policy: same-origin`,
`Permissions-Policy` and long-lived caching for hashed assets. No
Content-Security-Policy is set by default because the CMS and the Netlify
Identity widget load scripts and connect to several origins; if you add one,
test `/admin/` thoroughly.

## Dependency advisories

`npm audit --omit=dev` still reports advisories (no critical ones at the time
of the 2.0.0 release) in packages that Gatsby 5, Decap CMS 3 and `sharp`
depend on. Most affect build-time tooling or the development server rather
than the generated static files. They need upstream releases to fix; Dependabot
proposes updates weekly. `package.json` `overrides` pin patched versions of
`lodash` and `trim` where that is safe.
