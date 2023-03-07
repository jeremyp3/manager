export default class ResourceTypeSelectController {
  /* @ngInject */
  constructor($translate, $attrs, ReferenceService) {
    this.$translate = $translate;
    this.$attrs = $attrs;
    this.ReferenceService = ReferenceService;

    /**
     * Display the user's selection as closable chips below the select box
     * @type {{ name: string, data: string }[]}
     */
    this.chips = [];

    /**
     * Whether the controller is initializing
     * @type {boolean}
     */
    this.isInitializing = false;

    /**
     * Whether allow multiple resource types selection
     * @type {boolean}
     */
    this.multiple = false;

    /**
     * The select's name
     * @type {string}
     */
    this.name = 'resourceTypes';

    /**
     * Whether the select is required
     * @type {boolean}
     */
    this.required = false;

    /**
     * List of resource types
     * @type {string[]}
     */
    this.resourceTypes = [];

    /**
     * The input size attribute
     * @type {string}
     */
    this.size = 'xl';
  }

  $onInit() {
    if (!this.resourceTypes.length) {
      this.isInitializing = true;
      this.getResourceTypes().finally(() => {
        this.isInitializing = false;
      });
    }
  }

  $onChanges(changes) {
    Object.entries(changes).forEach(([key, { currentValue: value }]) => {
      switch (key) {
        case 'multiple':
          this.multiple = Boolean(this.$attrs.$attr.multiple);
          break;

        case 'ngModel':
          this.model = value;
          this.chips = value.map((data) => ({ name: data, data }));
          break;

        case 'options':
          this.formattedOptions = ResourceTypeSelectController.format(value);
          break;

        default:
          this[key] = value;
      }
    });
  }

  onModelChanged() {
    this.chips = this.model.map((data) => ({ name: data, data }));
    this.requiredNgModel.$setViewValue(this.model);
  }

  onChipRemoved(chips) {
    this.model = chips.map(({ data }) => data);
    this.onModelChanged();
  }

  getResourceTypes() {
    return this.ReferenceService.getResourceTypes()
      .then((resourceTypes) => {
        this.resourceTypes = resourceTypes;
      })
      .catch((error) => {
        this.onError({ error });
      });
  }

  static format(options = '') {
    return options.replace(/\$\{\s*resourceTypes\s*\}/g, '$ctrl.resourceTypes');
  }
}
