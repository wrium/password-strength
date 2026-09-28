import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { JSDOM } from 'jsdom';
import { createApp, ref } from '@wrium/wrium';
import { PasswordStrengthPlugin } from '../index.js';

/**
 * Integration coverage against the real, published wrium runtime (not a
 * mock) - proves the plugin actually registers and drives the
 * v-password-strength directive the way a real consumer would use it.
 */
describe('PasswordStrengthPlugin (v-password-strength directive)', () => {
    let dom, document, container;

    beforeEach(() => {
        dom = new JSDOM('<!DOCTYPE html><html><body><div id="app"></div></body></html>');
        global.document = dom.window.document;
        global.window = dom.window;
        document = dom.window.document;
        container = document.getElementById('app');
    });

    afterEach(() => {
        if (container) container.innerHTML = '';
    });

    function typeInto(input, value) {
        input.value = value;
        input.dispatchEvent(new dom.window.Event('input', { bubbles: true }));
    }

    it('assesses the initial (empty) value on mount, before any input', () => {
        container.innerHTML = '<input v-password-strength="strength" />';
        const strength = ref(null);
        const app = createApp(() => ({ strength }));
        app.use(PasswordStrengthPlugin);
        app.mount(container);

        expect(strength.value).toEqual({ label: 'empty', valid: false, reasons: [] });
    });

    it('writes an assessment into the target ref as the user types', () => {
        container.innerHTML = '<input v-password-strength="strength" />';
        const strength = ref(null);
        const app = createApp(() => ({ strength }));
        app.use(PasswordStrengthPlugin);
        app.mount(container);

        const input = container.querySelector('input');
        typeInto(input, '123456');
        expect(strength.value.label).toBe('weak');

        typeInto(input, 'K7$mQz9!vLp2');
        expect(strength.value.label).toBe('strong');
        expect(strength.value.valid).toBe(true);
    });

    it('respects plugin-level options (minLength, minScore)', () => {
        container.innerHTML = '<input v-password-strength="strength" />';
        const strength = ref(null);
        const app = createApp(() => ({ strength }));
        app.use(PasswordStrengthPlugin, { minLength: 20, minScore: 'strong' });
        app.mount(container);

        const input = container.querySelector('input');
        typeInto(input, 'Tr0ub4dor&3'); // strong by default options, but short of minLength: 20
        expect(strength.value.reasons.some(r => /at least 20 characters/.test(r))).toBe(true);
        expect(strength.value.valid).toBe(false); // minScore: 'strong' also raises the bar
    });

    it('reports an error and does not throw when the target is not a ref()', () => {
        container.innerHTML = '<input v-password-strength="notARef" />';
        const app = createApp(() => ({ notARef: 'plain string' }));
        app.use(PasswordStrengthPlugin);

        expect(() => app.mount(container)).not.toThrow();
    });
});
