---
name: ponytail-review
description: "Code review focused exclusively on over-engineering. Finds what to delete: reinvented stdlib, unneeded dependencies, speculative abstractions, dead flexibility. One line per finding: location, what to cut, what replaces it."
---

# Ponytail — Review Skill

## Output Format
`L<line>: <tag> <what>. <replacement>.`  
or `<file>:L<line>: ...` for multi-file diffs.

## Tags
| Tag | Meaning | Replacement |
|---|---|---|
| `delete:` | Dead code, unused flexibility, speculative feature | nothing |
| `stdlib:` | Hand-rolled thing the stdlib ships | Name the function |
| `native:` | Dep or code doing what the platform already does | Name the feature |
| `yagni:` | Abstraction/one-impl, config nobody sets, layer/one-caller | remove or flatten |
| `shrink:` | Same logic, fewer lines | Show the shorter form |

## Anti-Patterns to Hunt
- EmailValidator class that wraps a regex → `stdlib: use built-in email validation or a one-liner`
- Date picker library when `<input type="date">` exists → `native: <input type="date">`
- Custom retry logic when the HTTP lib already retries → `stdlib: use lib's built-in retry`
- Abstract factory with one concrete product → `yagni: direct instantiation`
- Config file for a value that never changes → `yagni: hardcode or constant`
- Wrapper around a function that just calls it → `delete: call directly`
- New utility package re-implementing `_.groupBy` or `Array.from` → `stdlib: use built-in`
