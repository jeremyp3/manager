import get from 'lodash/get';
import { DATABASE_TYPES } from '../../../databases.constants';
import { ADD_USER_FORM_RULES } from './add.constants';

export default class AddUserCtrl {
  /* @ngInject */
  constructor($translate, DatabaseService, $timeout) {
    this.$translate = $translate;
    this.DatabaseService = DatabaseService;
    this.inputRules = ADD_USER_FORM_RULES;
    this.$timeout = $timeout;
    this.checkPattern = AddUserCtrl.checkPattern;
  }

  $onInit() {
    this.trackDashboard('users::add_a_user', 'page');
    this.rolesList = AddUserCtrl.getRoles(this.roles);
    this.isAdvancedRole = this.isFeatureActivated(
      'isAdvancedRole',
      this.database.engine,
    );
    this.model = {
      username: '',
      password: '',
      group: '',
      categories: [],
      channels: [],
      commands: [],
      keys: [],
      selectedRoles: [],
    };
    this.isRolesReadOnly = !this.isFeatureActivated('getRoles');
    this.hasGroups = this.isFeatureActivated('usersGroup');
    if (this.isRolesReadOnly) {
      this.model.selectedRoles = [];
    }
    this.addDisableRoleButton = true;
  }

  isButtonDeleteDisplayed($index) {
    const isFirstItem = $index === 0 && !this.model.selectedRoles[$index].added;
    return this.model.selectedRoles[$index].added || isFirstItem;
  }

  isButtonDeleteEnabled($index) {
    const isFirstItem = $index === 0 && !this.model.selectedRoles[$index].added;
    return (
      isFirstItem ||
      (this.model.selectedRoles[$index].added && !this.processing)
    );
  }

  addEmptyEntry() {
    this.getAvailableRoles();
    if (this.availableRoles.length > 0) {
      this.model.selectedRoles.push({});
    }
  }

  onAdvancedRoleChanged(modelValue, $index) {
    this.model.selectedRoles[$index].key = null;
    // reset value on field change to avoid invalid data
    this.model.selectedRoles[$index].value = undefined;
    this.$timeout(() => {
      this.model.selectedRoles[$index].key = modelValue;
      this.checkDisableOrNot(this.model.selectedRoles[$index]);
    });
  }

  onAddAdvancedRole() {
    const addedRole = this.model.selectedRoles[
      this.model.selectedRoles.length - 1
    ];
    // check error
    if (
      !addedRole.admin &&
      this.model.selectedRoles.filter(
        (role) =>
          role.key.name === addedRole.key.name &&
          role.value === addedRole.value,
      ).length > 1
    ) {
      addedRole.error = true;
    } else {
      addedRole.error = false;
      this.model.selectedRoles[
        this.model.selectedRoles.length - 1
      ].added = true;
      this.addDisableRoleButton = true;
      this.addEmptyEntry();
    }
  }

  onRemoveAdvancedRole($index) {
    this.model.selectedRoles.splice($index, 1);
    this.getAvailableRoles();
  }

  get configuredRoles() {
    return this.model.selectedRoles.filter((role) => role.added).length;
  }

  static checkPattern(value, pattern) {
    return pattern.test(value);
  }

  checkDisableOrNot(role) {
    if (role.key.admin || role.value !== undefined) {
      this.addDisableRoleButton = false;
    } else {
      this.addDisableRoleButton = true;
    }
  }

  static getRoles(roles) {
    const newRolesList = [];
    roles.map((role) =>
      newRolesList.push({
        name: role.name.split('@')[0],
        admin: role.name.includes('admin'),
        db: role.name.includes('admin') ? 'admin' : '',
      }),
    );
    return newRolesList;
  }

  getAvailableRoles() {
    this.availableRoles = this.rolesList.filter(
      (role) =>
        !this.model.selectedRoles.find(
          (addedRole) =>
            role.admin && addedRole.key && addedRole.key.name === role.name,
        ),
    );
  }

  getUserFromModel() {
    const user = {
      name: this.model.username,
    };
    if (this.database.engine === DATABASE_TYPES.REDIS) {
      user.categories = this.model.categories;
      user.channels = this.model.channels;
      user.commands = this.model.commands;
      user.keys = this.model.keys;
    }
    if (this.isFeatureActivated('getRoles')) {
      user.roles = this.model.selectedRoles
        .filter((role) => (this.isAdvancedRole ? role.added : true))
        .map((role) => {
          if (this.isAdvancedRole) {
            const db = role.key.admin ? role.key.db : role.value;
            return `${role.key.name}@${db}`;
          }
          return role.name;
        });
    }
    if (this.hasGroups && this.model.group) {
      user.group = this.model.group;
    }
    return user;
  }

  addUser() {
    if (this.model.username) {
      this.trackDashboard('users::add_a_user::validate');
      this.processing = true;
      this.DatabaseService.addUser(
        this.projectId,
        this.database.engine,
        this.database.id,
        this.getUserFromModel(),
      )
        .then((createdUser) =>
          this.goBack({
            textHtml: this.$translate.instant(
              'pci_databases_users_add_success_message',
              {
                username: createdUser.username,
                password: createdUser.password,
              },
            ),
          }),
        )
        .catch((err) =>
          this.goBack(
            this.$translate.instant('pci_databases_users_add_error_save', {
              message: get(err, 'data.message', null).replace(/"/g, ''),
            }),
            'error',
          ),
        );
    }
  }

  cancel() {
    this.trackDashboard('users::add_a_user::cancel');
    this.goBack();
  }
}
