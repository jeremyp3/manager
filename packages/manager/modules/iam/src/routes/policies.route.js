import { policies as policiesComponent } from '@iam/components';
import {
  asParams,
  asQuery,
  asResolve,
  cursorsParamResolve,
  noBreadcrumbResolve,
} from '@iam/resolves';
import deletePolicyRoute from './deletePolicy.route';

const name = 'policies';
const children = [deletePolicyRoute];
const params = [cursorsParamResolve];
const resolves = [noBreadcrumbResolve];

const state = () => ({
  url: `?${asQuery(params)}`,
  component: policiesComponent.name,
  params: {
    ...asParams(params),
  },
  resolve: {
    ...asResolve(policiesComponent.resolves),
    ...asResolve(resolves),
  },
});

export default {
  name,
  children,
  state,
};
