export function dateTimeToCron(date: Date): string {
  const minutes = date.getUTCMinutes();
  const horas = date.getHours();
  const seconds = date.getSeconds();
  return `${seconds} ${minutes} ${horas} * * * `;
}
