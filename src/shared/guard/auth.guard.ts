import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { inject } from '@angular/core';
import { AuthGuardData, createAuthGuard } from 'keycloak-angular';

const isAccessAllowed = async (
  route: ActivatedRouteSnapshot,
  _: RouterStateSnapshot,
  authData: AuthGuardData
): Promise<boolean | UrlTree> => {
  const { authenticated, grantedRoles } = authData;
  const router = inject(Router);

  const fallbackUrl = route.data['redirect'] || '/forbidden';

  if (!authenticated) {
    return router.parseUrl(fallbackUrl);
  }

  const requiredRole = route.data['role'];
  if (!requiredRole) {
    return true;
  }

  const hasRequiredRole = (role: string): boolean =>
    Object.values(grantedRoles.resourceRoles).some((roles) => roles.includes(role));

  if (hasRequiredRole(requiredRole)) {
    return true;
  }

  return router.parseUrl(fallbackUrl);
};

export const canActivateAuthRole = createAuthGuard<CanActivateFn>(isAccessAllowed);

const isNoAuthAccessAllowed = async (
  route: ActivatedRouteSnapshot,
  _: RouterStateSnapshot,
  authData: AuthGuardData
): Promise<boolean | UrlTree> => {
  const { authenticated } = authData;
  const router = inject(Router);

  if (authenticated) {
    const fallbackUrl = route.data['redirect'] || '/';
    return router.parseUrl(fallbackUrl);
  }

  return true;
};

export const canActivateNoAuth = createAuthGuard<CanActivateFn>(isNoAuthAccessAllowed);
