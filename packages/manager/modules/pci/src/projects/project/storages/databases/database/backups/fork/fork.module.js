import angular from 'angular';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ui-kit';

import forkComponent from './fork.component';
import routing from './fork.routing';

const moduleName = 'ovhManagerPciStoragesDatabaseBackupsFork';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'oui',
    'ui.router',
  ])
  .config(routing)
  .component('ovhManagerPciStoragesDatabaseBackupsForkComponent', forkComponent)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
