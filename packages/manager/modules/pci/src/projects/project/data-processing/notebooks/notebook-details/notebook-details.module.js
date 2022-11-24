import angular from 'angular';
import angularTranslate from 'angular-translate';
import '@uirouter/angularjs';

import routing from './notebook-details.routing';

import dataProcessingNotebookDetailsComponent from './notebook-details.component';
import notebookStatus from '../notebook-status';
import terminateNotebook from './terminate-notebook';

const moduleName = 'ovhManagerPciProjectDataProcessingNotebookDetails';

angular
  .module(moduleName, [
    'ui.router',
    angularTranslate,
    notebookStatus,
    terminateNotebook,
  ])
  .config(routing)
  .component(
    'pciProjectDataProcessingNotebookDetails',
    dataProcessingNotebookDetailsComponent,
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
