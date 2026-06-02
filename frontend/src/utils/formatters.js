export function money(value) {
  return `Rs. ${Number(value || 0).toLocaleString("en-IN")}`;
}

export function percent(value) {
  return `${Number(value || 0).toFixed(0)}%`;
}
