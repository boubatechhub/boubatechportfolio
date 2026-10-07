/** Extrait la dernière année d'une période (ex. « 2024 - Présent »). */
export function getLastYearFromPeriod(period: string): number {
  const p = period.toLowerCase();
  if (p.includes("en cours") || p.includes("présent")) return 9999;
  const years = period.match(/\d{4}/g);
  return years ? Math.max(...years.map(Number)) : 0;
}
