/**
 * In-memory (module-scope) flag for whether the Hero intro has already
 * played during this page load.
 *
 * Why not sessionStorage/localStorage:
 * Those persist across full browser refreshes (they're scoped to the tab
 * or the origin, not to a single script execution), so they can't express
 * "reset on refresh, keep across client-side navigation."
 *
 * A plain module-level variable does exactly what we need:
 * - Client-side route changes (React Router, etc.) never re-execute this
 *   module's top-level code, so `introPlayed` survives navigation.
 * - A hard refresh (F5 / Ctrl+R) re-parses and re-executes the entire JS
 *   bundle from scratch, so this variable is re-initialized to `false`
 *   automatically — no cleanup code needed anywhere.
 */
let introPlayed = false;

export function hasIntroPlayed() {
  return introPlayed;
}

export function markIntroPlayed() {
  introPlayed = true;
}