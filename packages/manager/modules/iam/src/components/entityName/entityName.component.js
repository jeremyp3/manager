import controller from './entityName.controller';
import template from './entityName.template.html';

export default {
  bindings: {
    entity: '<?',
    errorMessages: '<?',
    name: '@?',
    ngModel: '<',
    required: '@?',
    size: '@?',
  },
  require: {
    requiredNgModel: '^ngModel',
  },
  controller,
  template,
};
