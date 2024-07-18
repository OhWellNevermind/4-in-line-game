export function createApiResponse(payload: any, error?: boolean) {
  return {
    success: !error,
    ...payload,
  };
}
