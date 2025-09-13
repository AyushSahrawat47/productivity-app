export function successResponse<T>(data: T, message = "Success", status = 200) {
  return Response.json(
    {
      success: true,
      message,
      data,
    },
    { status }
  );
}

export function errorResponse(message = "Something went wrong", status = 500) {
  return Response.json(
    {
      success: false,
      message,
    },
    { status }
  );
}
