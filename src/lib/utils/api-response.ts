export class ApiError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

export const apiResponse = {
  success: <T>(data: T, status = 200) => {
    return Response.json({ success: true, data }, { status });
  },
  error: (message: string, status = 400) => {
    return Response.json({ success: false, error: message }, { status });
  },
};
