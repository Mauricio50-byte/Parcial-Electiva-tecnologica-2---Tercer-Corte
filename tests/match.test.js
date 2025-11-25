const { getMatchResult, updateStandings } = require('../src/match');

describe('fútbol — enfrentamientos', () => {
  test('victoria local', () => {
    const r = getMatchResult('River', 'Boca', 2, 1);
    expect(r.winner).toBe('home');

    const table = {};
    updateStandings(table, r);
    expect(table.River.points).toBe(3);
    expect(table.Boca.points).toBe(0);
  });

  test('victoria visitante', () => {
    const r = getMatchResult('Madrid', 'Barça', 0, 1);
    expect(r.winner).toBe('away');

    const table = {};
    updateStandings(table, r);
    expect(table.Barça.points).toBe(3);
    expect(table.Madrid.points).toBe(0);
  });

  test('empate suma 1 punto a cada equipo', () => {
    const r = getMatchResult('City', 'United', 2, 2);
    expect(r.winner).toBeNull();

    const table = {};
    updateStandings(table, r);
    expect(table.City.points).toBe(1);
    expect(table.United.points).toBe(1);
  });

  test('validaciones de entrada', () => {
    expect(() => getMatchResult('', 'Bayern', 1, 0)).toThrow();
    expect(() => getMatchResult('PSG', '', 1, 0)).toThrow();
    expect(() => getMatchResult('PSG', 'Lyon', -1, 0)).toThrow();
    expect(() => getMatchResult('PSG', 'Lyon', 0.5, 0)).toThrow();
    expect(() => getMatchResult('PSG', 'Lyon', 0, -2)).toThrow();
  });
});
