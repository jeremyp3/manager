import controller from './onboarding.controller';
import template from './onboarding.html';

export default {
  controller,
  template,
  bindings: {
    publicGateways: '<',
    gateways: '<',
    trackPublicGateways: '<',
    guideUrl: '<',
    goToAddPublicGateway: '<',
  },
};
