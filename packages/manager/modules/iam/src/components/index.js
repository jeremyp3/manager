import angular from 'angular';

import createPolicyComponent from './createPolicy/createPolicy.component';
import createPolicyResolves from './createPolicy/createPolicy.resolves';
import deleteEntityComponent from './deleteEntity/deleteEntity.component';
import deleteEntityResolves from './deleteEntity/deleteEntity.resolves';
import entityNameComponent from './entityName/entityName.component';
import iamComponent from './iam/iam.component';
import policiesComponent from './policies/policies.component';
import policiesResolves from './policies/policies.resolves';
import policyComponent from './policy/policy.component';
import policyResolves from './policy/policy.resolves';
import resourceTypeSelectComponent from './resourceTypeSelect/resourceTypeSelect.component';

// ---------------------------------------------------------------------------------------------------- //

const createPolicy = {
  name: 'iamCreatePolicy',
  component: createPolicyComponent,
  resolves: createPolicyResolves,
};

const deleteEntity = {
  name: 'iamDeleteEntity',
  component: deleteEntityComponent,
  resolves: deleteEntityResolves,
};

const entityName = {
  name: 'iamEntityName',
  component: entityNameComponent,
  resolves: null,
};

const iam = {
  name: 'iam',
  component: iamComponent,
  resolves: null,
};

const policies = {
  name: 'iamPolicies',
  component: policiesComponent,
  resolves: policiesResolves,
};

const policy = {
  name: 'iamPolicy',
  component: policyComponent,
  resolves: policyResolves,
};

const resourceTypeSelect = {
  name: 'iamResourceTypeSelect',
  component: resourceTypeSelectComponent,
  resolves: null,
};

// ---------------------------------------------------------------------------------------------------- //

const moduleName = 'ovhManagerIAMComponents';

angular
  .module(moduleName, [])
  .component(createPolicy.name, createPolicy.component)
  .component(deleteEntity.name, deleteEntity.component)
  .component(entityName.name, entityName.component)
  .component(iam.name, iam.component)
  .component(policies.name, policies.component)
  .component(policy.name, policy.component)
  .component(resourceTypeSelect.name, resourceTypeSelect.component)
  .run(/*
    @ngTranslationsInject:json
      ./createPolicy/translations
      ./deleteEntity/translations
      ./entityName/translations
      ./iam/translations
      ./policies/translations
      ./policy/translations
      ./resourceTypeSelect/translations
  */);

// ---------------------------------------------------------------------------------------------------- //

export {
  createPolicy,
  deleteEntity,
  entityName,
  iam,
  policies,
  policy,
  resourceTypeSelect,
};
export default moduleName;
