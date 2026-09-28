# Changelog

All notable changes to this project are documented in this file.
Format loosely follows [Keep a Changelog](https://keepachangelog.com/).

## [1.0.0]

First standalone release. Extracted from `wrium`'s built-in
`src/plugins/password-strength.js` (unchanged logic - it was written from
the start to depend on nothing but the plugin `api` object, specifically so
it could move into its own package without edits).

### Added

- `PasswordStrengthPlugin` - registers `v-password-strength`
- `assessPassword(password, options)` - the underlying pure function,
  also usable standalone (e.g. server-side re-validation)
- `DEFAULT_COMMON_PASSWORDS` - the built-in blocklist, exported for
  extension (merge it yourself if you want to add to it rather than
  replace it via the `commonPasswords` option)
