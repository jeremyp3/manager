import controller from './resourceTypeSelect.controller';
import template from './resourceTypeSelect.template.html';

export default {
  bindings: {
    multiple: '@?',
    name: '@?',
    ngModel: '<',
    onError: '&?',
    options: '@',
    required: '@?',
    resourceTypes: '<?',
    size: '@?',
  },
  require: {
    requiredNgModel: '^ngModel',
  },
  controller,
  template,
};
