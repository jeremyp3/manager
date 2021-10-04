import angular from 'angular';

import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@ovh-ux/ng-ovh-swimming-poll';
import '@ovh-ux/ui-kit';

import { timeRange, chartjs } from '@ovh-ux/manager-components';
import component from './metrics.component';
import routing from './metrics.routing';

const moduleName = 'ovhManagerPciStoragesDatabasesMetrics';

angular
  .module(moduleName, [
    'ngOvhCloudUniverseComponents',
    'ngOvhSwimmingPoll',
    'oui',
    'ovhManagerPciComponents',
    timeRange,
    chartjs,
  ])
  .config(routing)
  .component('ovhManagerPciStoragesDatabaseMetricsComponent', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
