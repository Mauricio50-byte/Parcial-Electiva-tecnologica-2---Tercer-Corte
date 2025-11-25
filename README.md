# Parcial — CI/CD con calidad (Node.js + fútbol)

Pequeño proyecto educativo para practicar un pipeline de calidad continuo en Node.js sobre un dominio simple: partidos de fútbol y tabla de posiciones. Incluye linting, build con Babel, pruebas con cobertura y un workflow en GitHub Actions que funciona también con `act` (requiere Docker).

## Qué hace el proyecto

- Calcula el resultado de un partido con validaciones de entrada.
- Actualiza una tabla de posiciones acumulando partidos, puntos, goles y récord.
- Aplica un umbral de cobertura global del 80% como “quality gate”.
- Permite simular fallos controlados con `DEMO_FAIL=1` para ensayar el pipeline.

## Requisitos

- `Node.js 18+` y `npm`.
- `Docker` en ejecución (necesario para `act`).
- `act` instalado para ejecutar el workflow localmente.

## Instalación y scripts

- `npm ci` — Instala dependencias del proyecto.
- `npm run lint` — Ejecuta ESLint sobre `src` y `tests`.
- `npm run build` — Transpila `src` a `dist` con Babel.
- `npm test` — Ejecuta Jest con cobertura y aplica el umbral del 80%.

## Uso (API)

```js
const { getMatchResult, updateStandings } = require('./src/match');

// Resultado del partido
const r = getMatchResult('River', 'Boca', 2, 1);
// r => { homeTeam: 'River', awayTeam: 'Boca', homeGoals: 2, awayGoals: 1, winner: 'home' }

// Tabla de posiciones
const table = {};
updateStandings(table, r);
// table.River.points === 3; table.Boca.points === 0
```

### Detalles de la API

- `getMatchResult(homeTeam, awayTeam, homeGoals, awayGoals)`
  - Valida equipos como strings no vacíos y goles como enteros ≥ 0.
  - Devuelve un objeto `{ homeTeam, awayTeam, homeGoals, awayGoals, winner }` donde `winner` es `'home'`, `'away'` o `null` (empate).
  - Si `DEMO_FAIL=1` y hay empate, fuerza `winner='home'` para demostrar cómo el pipeline detecta errores lógicos.
- `updateStandings(standings, result)`
  - Recibe un objeto acumulador `standings` y el `result` anterior.
  - Crea entradas por equipo si no existen y actualiza: `played`, `points`, `wins`, `draws`, `losses`, `gf`, `ga`.
  - Devuelve el mismo objeto `standings` mutado.

## Pipeline en GitHub Actions

- Workflow: `.github/workflows/ci-quality.yml`.
- Disparadores: `push` y `pull_request`.
- Pasos: checkout → setup-node → `npm ci` → `npm run lint` → `npm run build` → `npm test`.
- Artefacto de cobertura: `coverage/lcov.info`.
- El run falla si:
  - Hay errores de ESLint.
  - Las pruebas fallan.
  - La cobertura global es < 80% (ver `jest.config.js`).

## Ejecutar el workflow localmente con `act`

- `act push -W .github/workflows/ci-quality.yml`
- `act pull_request -W .github/workflows/ci-quality.yml`
- Si necesitas especificar imagen base:
  - `act push -W .github/workflows/ci-quality.yml -P ubuntu-latest=catthehacker/ubuntu:act-latest`
- Para ensayar un fallo controlado (cambia empates a victoria local):
  - `act push -W .github/workflows/ci-quality.yml --env DEMO_FAIL=1`

## Cobertura

- Umbral global 80% definido en `jest.config.js` para branches, functions, lines y statements.
- Reportes en `coverage/` (`text`, `lcov`, `json-summary`). El HTML puede abrirse desde `coverage/lcov-report/index.html`.

## Estructura del repo

- Código: `src/match.js`.
- Pruebas: `tests/match.test.js`.
- Configuración: `eslint.config.js`, `babel.config.js`, `jest.config.js`.
- CI/CD: `.github/workflows/ci-quality.yml`.

## Solución de problemas (Windows)

- Si PowerShell bloquea `npm.ps1`, ejecuta con `npm.cmd`:
  - `& "C:\\Program Files\\nodejs\\npm.cmd" run lint`
  - `& "C:\\Program Files\\nodejs\\npm.cmd" run build`
  - `& "C:\\Program Files\\nodejs\\npm.cmd" test`
