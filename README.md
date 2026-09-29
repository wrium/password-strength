<p align="center">
  <img src="./assets/password-strength.webp" alt="Wrium Password Strength logo" width="200" />
</p>

# Wrium Password Strength

A [Wrium](https://github.com/wrium/wrium) plugin that flags weak or common
passwords as the user types, via a `v-password-strength` directive.

- Blocks an exact/substring match against a common-password list
- Flags sequential runs (`abc`, `123`) and repeated characters (`aaaa`)
- Scores character-class variety (lowercase, uppercase, digit, symbol)
- Zero dependencies, ~1 KB

## Installation

```bash
npm install @wrium/password-strength
```

`@wrium/wrium` is a peer dependency - install it too if you haven't already.

## Usage

```js
import { createApp, ref } from '@wrium/wrium';
import { PasswordStrengthPlugin } from '@wrium/password-strength';

createApp(() => ({
    password: ref(''),
    strength: ref(null)
}))
    .use(PasswordStrengthPlugin, { minLength: 10, minScore: 'good' })
    .mount('#app');
```

```html
<input type="password" v-model="password" v-password-strength="strength" />
<p>Strength: {{ strength?.label }}</p>
<button :disabled="!strength?.valid">Submit</button>
```

`v-password-strength="someRef"` must point at a `ref()` - it writes
`{ label, valid, reasons }` into it on every input.

## Options

Passed as the second argument to `.use(PasswordStrengthPlugin, options)`:

| Option | Default | Description |
|--------|---------|-------------|
| `minLength` | `8` | Length considered a baseline |
| `minScore` | `'fair'` | Minimum label (`'weak' \| 'fair' \| 'good' \| 'strong'`) for `valid` to be `true` |
| `commonPasswords` | built-in list | Overrides the blocklist entirely (a `Set<string>` or `string[]`) |

## `assessPassword(password, options)`

Also exported directly as a pure function - no DOM, no reactivity - for
validating the same way outside a template (e.g. before a submit that also
hits a server):

```js
import { assessPassword } from '@wrium/password-strength';

assessPassword('correcthorsebatterystaple');
// => { label: 'fair', valid: true, reasons: ['Mix letters, numbers, and symbols'] }
```

## What This Isn't

The built-in blocklist is short and well-known - it catches the obvious
cases, not a breach-database lookup. For high-stakes applications, pair this
with a real server-side check (e.g. against the Have I Been Pwned API).

## License

MIT
