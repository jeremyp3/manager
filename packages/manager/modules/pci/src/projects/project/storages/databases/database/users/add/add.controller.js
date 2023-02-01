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
    if (this.isAdvancedRole) {
      this.addEmptyEntry();
    }
  }

  addEmptyEntry() {
    this.model.selectedRoles.push({});
  }

  onRoleChanged(modelValue, $index) {
    this.model.selectedRoles[$index].key = null;
    // reset value on field change to avoid invalid data
    this.model.selectedRoles[$index].value = undefined;
    this.$timeout(() => {
      this.model.selectedRoles[$index].key = modelValue.name;
      this.model.selectedRoles[$index].value = modelValue;
    });
  }

  onAddRole($index) {
    this.model.selectedRoles[$index].added = true;
    this.model.selectedRoles.push({});
  }

  onRemoveRole($index) {
    this.model.selectedRoles.splice($index, 1);
  }

  static checkPattern(value, pattern) {
    return pattern.test(value);
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
      user.roles = this.model.selectedRoles.map((role) => {
        if (this.isAdvancedRole) {
          return `${role.value.name}@${role.value.db}`;
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
