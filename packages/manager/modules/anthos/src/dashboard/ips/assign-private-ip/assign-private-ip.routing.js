import { TRACKING_PREFIX } from '../../constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('anthos.dashboard.ips.assign-private-ip', {
    url: '/assign-private-ip',
    views: {
      modal: {
        component: 'assignPrivateIp',
      },
    },
    layout: 'modal',
    resolve: {
      breadcrumb: () => null,

      assignPrivateIpHitTracking: () => {
        return 'assign-private-ip';
      },
    },
    atInternet: {
      rename: `${TRACKING_PREFIX}::assign-private-ip`,
    },
  });
};
