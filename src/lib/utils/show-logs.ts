export function showLogs(message: string) {
  if (process.env.NODE_ENV === "development") {
    console.log(message);
  }
}

export function showError(error: string) {
  if (process.env.NODE_ENV === "development") {
    console.error(error);
  }
}
