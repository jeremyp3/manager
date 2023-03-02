import { createPolicy as createPolicyComponent } from '@iam/components';
import { asResolve, createPolicyBreadcrumbResolve } from '@iam/resolves';

const name = 'createPolicy';
const resolves = [createPolicyBreadcrumbResolve];

const state = () => ({
  url: '/policy/create',
  component: createPolicyComponent.name,
  resolve: {
    ...asResolve(createPolicyComponent.resolves),
    ...asResolve(resolves),
  },
});

export default {
  name,
  state,
};
