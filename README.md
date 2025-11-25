# Parcial — CI/CD con Calidad en Node.js

## Requisitos

- Node.js 18+ y npm.
- Docker instalado y corriendo.
- `act` (nektos/act) para ejecutar GitHub Actions localmente.

## Scripts

- `npm run lint` — Ejecuta ESLint sobre el repo.
- `npm run build` — Compila `src` a `dist` con Babel.
- `npm test` — Ejecuta Jest con cobertura y umbral global (80%).

## Pipeline en GitHub Actions

- Workflow: `.github/workflows/ci-quality.yml`.
- Disparadores: `push` y `pull_request`.
- Pasos: checkout → setup-node → `npm ci` → `npm run lint` → `npm run build` → `npm test`.
- Artefacto de cobertura: `coverage/lcov.info`.
- El run falla si:
  - Linter tiene errores.
  - Pruebas fallan.
  - Cobertura global < 80% (configurada en `jest.config.js`).

## Ejecutar localmente con `act`

1. Instala `act` según tu OS.
2. Desde la raíz del repo, ejecuta:
   - `act push -W .github/workflows/ci-quality.yml`
   - `act pull_request -W .github/workflows/ci-quality.yml`
3. Si es necesario, especifica imagen base:
   - `act push -W .github/workflows/ci-quality.yml -P ubuntu-latest=catthehacker/ubuntu:act-latest`
4. Para simular un run fallido controlado  usa variable de entorno:
   - `act push -W .github/workflows/ci-quality.yml --env DEMO_FAIL=1`
   - Falla la etapa de pruebas (empate marcado como victoria local).

## Cobertura y umbral

- Umbral global 80% (branches, functions, lines, statements) definido en `jest.config.js`.
- Reportes generados en `coverage/` (`text`, `lcov`, `json-summary`).
- Para ver HTML, instala `jest-html-reporters` (opcional) o usa herramientas que consuman `lcov.info`.

## Solución de problemas en Windows

- Si PowerShell bloquea `npm.ps1`, usa:
  - `& "C:\\Program Files\\nodejs\\npm.cmd" run lint`
  - `& "C:\\Program Files\\nodejs\\npm.cmd" run build`
  - `& "C:\\Program Files\\nodejs\\npm.cmd" test`

## Estructura

- Código: `src/` (principal `src/match.js`).
- Pruebas: `tests/match.test.js`.
- Configuración: `eslint.config.js`, `babel.config.js`, `jest.config.js`.
- CI/CD: `.github/workflows/ci-quality.yml`.

## Dominio del proyecto

- Enfrentamientos de fútbol.
- `getMatchResult` y `updateStandings` calculan ganador y actualizan tabla.
