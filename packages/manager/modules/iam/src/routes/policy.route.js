import { policy as policyComponent } from '@iam/components';
import { asResolve, noBreadcrumbResolve } from '@iam/resolves';
import policiesRoute from './policies.route';

const name = 'policy';
const children = [policiesRoute];
const resolves = [noBreadcrumbResolve];

const state = ({ ROUTES }) => ({
  url: '/policy',
  component: policyComponent.name,
  redirectTo: ROUTES.POLICIES,
  resolve: {
    ...asResolve(policyComponent.resolves),
    ...asResolve(resolves),
  },
});

export default {
  name,
  children,
  state,
};
