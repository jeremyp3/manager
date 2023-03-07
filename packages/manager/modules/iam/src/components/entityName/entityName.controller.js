import { ENTITY } from '@iam/constants';

export default class EntityNameController {
  /* @ngInject */
  constructor($translate) {
    this.$translate = $translate;

    /**
     * The class of the entity. Default is the policy class
     * @see ENTITY
     * @type {string}
     */
    this.entity = ENTITY.POLICY;

    /**
     * The error messages to display, if any
     * @type {Object<string,string>}
     */
    this.errorMessages = {
      pattern: this.translations.pattern,
    };

    /**
     * The form's name
     * @type {string}
     */
    this.name = 'name';

    /**
     * Whether the input is required
     * @type {boolean}
     */
    this.required = false;

    /**
     * The input size attribute
     * @type {string}
     */
    this.size = 'xl';
  }

  get translations() {
    const { entity } = this;
    const { instant: $t } = this.$translate;
    return {
      label: $t(`iam_entity_name_${entity}_name_label`),
      pattern: $t(`iam_entity_name_${entity}_error_pattern`),
    };
  }

  $onChanges(changes) {
    Object.entries(changes).forEach(([key, { currentValue: value }]) => {
      switch (key) {
        case 'ngModel':
          this.model = value;
          break;

        case 'errorMessages':
          this.errorMessages = { ...value, pattern: this.translations.pattern };
          break;

        default:
          this[key] = value;
      }
    });
  }

  onModelChanged() {
    this.requiredNgModel.$setViewValue(this.model);
  }
}
