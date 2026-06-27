/**
 * Client-side account management service.
 *
 * In production, replace with real API calls:
 *   POST /api/account/update      { name?, email? }
 *   DELETE /api/account/delete
 *   POST /api/newsletter/unsubscribe { email }
 */

export async function updateProfile(): Promise<{ success: boolean; error?: string }> {
  await new Promise((r) => setTimeout(r, 500));

  // In production, this would POST to /api/account/update with { name, email }.
  // The AuthContext.updateUser handles the local simulation immediately for optimistic updates.
  return { success: true };
}

export async function deleteAccount(): Promise<{ success: boolean; error?: string }> {
  await new Promise((r) => setTimeout(r, 500));
  return { success: true };
}
