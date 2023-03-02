const key = 'breadcrumb';
const pfx = 'iam_resolves_breadcrumbs';

// ---------------------------------------------------------------------------------------------------- //

/**
 * The create policy breadcrumb
 * @returns {string}
 */
export const createPolicyBreadcrumbResolve = /* @ngInject */ ($translate) =>
  $translate.instant(`${pfx}_create_policy`);

createPolicyBreadcrumbResolve.key = key;

// ---------------------------------------------------------------------------------------------------- //

/**
 * The default breadcrumb
 * @returns {string}
 */
export const defaultBreadcrumbResolve = /* @ngInject */ ($translate) =>
  $translate.instant(`${pfx}_default`);

defaultBreadcrumbResolve.key = key;

// ---------------------------------------------------------------------------------------------------- //

/**
 * No breadcrumb (hide it)
 * @returns {null}
 */
export const noBreadcrumbResolve = () => null;

noBreadcrumbResolve.key = key;

// ---------------------------------------------------------------------------------------------------- //

export default {
  createPolicyBreadcrumbResolve,
  defaultBreadcrumbResolve,
  noBreadcrumbResolve,
};
