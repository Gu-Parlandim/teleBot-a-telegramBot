export function dateTimeToCron(date: Date): string {
  if (typeof date === "string") {
    date = new Date(date);
  }

  const minutes = date.getUTCMinutes();
  const horas = date.getHours();
  const seconds = date.getSeconds();
  return `${seconds} ${minutes} ${horas} * * * `;
}
