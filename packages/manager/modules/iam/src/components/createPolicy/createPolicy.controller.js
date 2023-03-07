import { cloneDeep } from 'lodash-es';

export default class CreatePolicyController {
  /**
   * A set of parsed error classes returned by the api
   * Keys are policy property names and values are translated errors
   *
   * For instance
   * { name: 'Some translated error' }
   *
   * @type {Object<string,string>}
   */
  error = {};

  /**
   * The NgFormController created by the template by using name="$ctrl.form"
   * @type {NgFormController}
   */
  form = null;

  /**
   * Whether the controller is submitting
   * @type {boolean}
   */
  isSubmitting = false;

  /**
   * The form's data model
   * @type {{
   *   name: string,
   * }}
   */
  model = {
    name: '',
  };

  /**
   * When the user submits the data, a snapshot of the model is created
   * If any error occures after the submission, it prevents the user from submitting the same data
   * @see {model}
   */
  modelSnapshot = null;

  /* @ngInject */
  constructor($timeout, PolicyService) {
    this.$timeout = $timeout;
    this.PolicyService = PolicyService;

    /**
     * List of selected resource types
     * Not part of the model
     * @type {string[]}
     */
    this.selectedResourceTypes = [];
  }

  /**
   * Whether the current controller's state allow the data to be submitted
   * @type {boolean}
   */
  get canSubmit() {
    return !this.isSubmitting && this.form?.$valid;
  }

  /**
   * Whether there is any error coming from the api
   * @type {boolean}
   */
  get hasAnyError() {
    return Object.values(this.error).length > 0;
  }

  $onInit() {
    // Wait for this.form to be attached
    this.$timeout(() => {
      this.form.$$controls.forEach((control) => {
        const { $name: property } = control;
        Object.assign(control.$validators, {
          // Each control is given this validator
          // It fails if :
          // - The API returns an error specific to that control
          // - The model of that control has not changed since the last submission
          api: (model) =>
            !this.error[property] || model !== this.modelSnapshot?.[property],
        });
      });
    });
  }

  createPolicy() {
    // >>> TO REMOVE >>>
    const data = {
      identities: [],
      permissions: { allow: [{ action: '*' }] },
      resources: [
        { urn: 'urn:v1:eu:resource:cdn:28dd67c9-1817-4c02-a3ab-76e96324b603' },
      ],
      name: this.model.name,
    };
    // <<< TO REMOVE <<<

    this.modelSnapshot = cloneDeep(this.model);
    this.isSubmitting = true;

    // this.$timeout(() => {
    //   this.isSubmitting = false;
    //   this.error = { name: 'plop' };
    //   this.runValidation();
    // }, 1000);
    // return;

    return this.PolicyService.createPolicy(data)
      .then(() => {
        this.error = {};
        return this.goBack({
          success: {
            key: 'iam_create_policy_success',
            values: { name: `<strong>${this.model.name}</strong>` },
          },
          reload: true,
        });
      })
      .catch((error) => {
        this.isSubmitting = false;

        if (error.data.policy) {
          this.error = error.data.policy;
          this.runValidation();
          return;
        }

        this.showCreationError(error);
      });
  }

  cancelCreation() {
    return this.goBack();
  }

  runValidation() {
    this.form.$$controls.forEach((control) => {
      control.$setDirty();
      control.$validate();
    });
  }

  showCreationError(error) {
    const { message } = error.data ?? {};
    this.alert.error('iam_create_policy_error_creation', { message });
  }
}
