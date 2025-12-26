export function formatDate(isoString: string): string {
  const newDate = new Date(isoString);
  const monthsArr = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ];
  const day = newDate.getDate();
  const temp = newDate.getMonth();
  const year = newDate.getFullYear();

  const month = monthsArr[temp];

  return `${day} ${month} ${year}`;
}
