let inFlightDepth = 0;

/** True while at least one deliberate sign-out is awaiting the BFF. */
export function isLogoutInFlight(): boolean {
  return inFlightDepth > 0;
}

export async function withLogoutInFlight<T>(run: () => Promise<T>): Promise<T> {
  inFlightDepth += 1;
  try {
    return await run();
  } finally {
    inFlightDepth -= 1;
  }
}

export function shouldRedirectToLogin(loading: boolean, isLoggedIn: boolean): boolean {
  return !loading && !isLoggedIn && !isLogoutInFlight();
}

/** Test-only reset so a leaked depth in one test cannot bleed into the next. */
export function resetLogoutInFlightForTests(): void {
  inFlightDepth = 0;
}
