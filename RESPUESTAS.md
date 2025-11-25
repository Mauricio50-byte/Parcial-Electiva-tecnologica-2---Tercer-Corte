# RESPUESTAS — Validación y logs

## Identificación de fallos en logs

- Linter (ESLint):
  - Un run fallido muestra reglas infringidas y rutas de archivos.
  - El paso "Lint" en Actions se marca en rojo y el workflow se detiene.
- Pruebas (Jest):
  - Muestra suites y tests fallidos con diff esperado/recibido.
  - El resumen final indica tests fallidos; el workflow se detiene.
  - En este proyecto de fútbol, el caso de empate espera `winner = null`.
- Cobertura (Jest):
  - Se imprime tabla de cobertura. Si el umbral global < 80%, Jest finaliza con error e impide continuar.

## Cómo generar un run fallido

- Por linter: introduce `==` en lugar de `===` o agrega una variable sin uso.
- Por pruebas (dominio fútbol): ejecuta pruebas con `DEMO_FAIL=1` para forzar que un empate sea marcado como victoria local.
  - Local (PowerShell): `$env:DEMO_FAIL=1; & "C:\\Program Files\\nodejs\\npm.cmd" test`
  - Con `act`: `act push -W .github/workflows/ci-quality.yml --env DEMO_FAIL=1`
- Por cobertura: sube temporalmente el umbral en `jest.config.js` a 100%.

## Cómo generar un run exitoso

- Revertir los cambios anteriores (no usar `DEMO_FAIL`) y ejecutar `npm run lint`, `npm run build`, `npm test` localmente.
- Hacer `push` y verificar que todos los pasos quedan en verde en Actions.


## Diferencias clave entre run fallido y exitoso

- Estado del workflow:
  - Fallido: marca en rojo el paso problemático y no genera artefactos.
  - Exitoso: todos los pasos en verde y artefacto `coverage/lcov.info` disponible.
- Mensajes de consola:
  - Fallido: mensajes de error con stack o reglas infringidas.
  - Exitoso: tabla de cobertura y conteos de tests pasados.
