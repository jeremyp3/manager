import {
  CHECK_PRICES_DOC_LINK,
  COLD_ARCHIVE_TRACKING,
  GUIDE_MENU_ITEMS,
  REGION,
} from './cold-archives.constants';
import { COLD_ARCHIVE_STATES } from './containers/containers.constants';
import { PCI_FEATURES } from '../../../projects.constant';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.storages.cold-archive', {
    url: '/cold-archive',
    component: 'pciProjectStorageColdArchive',
    onEnter: /* @ngInject */ (pciFeatureRedirect) => {
      return pciFeatureRedirect(PCI_FEATURES.PRODUCTS.COLD_ARCHIVE);
    },
    atInternet: {
      rename: `${COLD_ARCHIVE_TRACKING.PAGE_PREFIX}`,
    },
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('containers')
        .then((containers) =>
          containers.length === 0
            ? {
                state: 'pci.projects.project.storages.cold-archive.onboarding',
              }
            : {
                state: 'pci.projects.project.storages.cold-archive.containers',
              },
        ),
    resolve: {
      guideMenu: /* @ngInject */ (initGuides) => initGuides(GUIDE_MENU_ITEMS),

      initGuides: /* @ngInject */ (coreConfig, $translate) => (guides) => {
        return guides.reduce(
          (list, guide) => [
            ...list,
            {
              ...guide,
              title: $translate.instant(
                `pci_projects_project_storages_cold_archives_guides_${guide.id}_title`,
              ),
              description: $translate.instant(
                `pci_projects_project_storages_cold_archives_guides_${guide.id}_description`,
              ),
              link:
                guide.links[coreConfig.getUser()?.ovhSubsidiary] ||
                guide.links.DEFAULT,
            },
          ],
          [],
        );
      },

      priceLink: /* @ngInject */ (coreConfig) =>
        CHECK_PRICES_DOC_LINK[coreConfig.getUser()?.ovhSubsidiary] ||
        CHECK_PRICES_DOC_LINK.DEFAULT,

      onPriceLinkClick: /* @ngInject */ (atInternet) => () => {
        const hit = `${COLD_ARCHIVE_TRACKING.CLICK_PREFIX}_${COLD_ARCHIVE_TRACKING.SEE_PRICE}`;
        return atInternet.trackClick({
          name: hit,
          type: 'action',
        });
      },

      onGuideClick: /* @ngInject */ (atInternet) => (guideId) => {
        const hit = `${COLD_ARCHIVE_TRACKING.GUIDE}_${guideId}`;
        return atInternet.trackClick({
          name: hit,
          type: 'action',
        });
      },

      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('pci_projects_project_storages_cold_archive_label'),

      userList: /* @ngInject */ (projectId, allUserList) =>
        allUserList.filter((user) => user?.s3Credentials?.length > 0),

      allUserList: /* @ngInject */ (projectId, PciStoragesColdArchiveService) =>
        PciStoragesColdArchiveService.getAllS3Users(projectId).then((users) =>
          PciStoragesColdArchiveService.mapUsersToCredentials(projectId, users),
        ),

      isUserTabActive: /* @ngInject */ ($transition$, $state) => () =>
        $state.is(COLD_ARCHIVE_STATES.S3_USERS, $transition$.params()),

      isUserColdArchiveContainersTabActive: /* @ngInject */ (
        $transition$,
        $state,
      ) => () =>
        $state.is(COLD_ARCHIVE_STATES.CONTAINERS, $transition$.params()),

      userListLink: /* @ngInject */ ($state, projectId) =>
        $state.href('pci.projects.project.storages.cold-archive.users', {
          projectId,
        }),

      coldArchiveContainersLink: /* @ngInject */ ($state, projectId) =>
        $state.href('pci.projects.project.storages.cold-archive', {
          projectId,
        }),

      // The region parameter is for now hard-coded.
      // waiting the API fix PCINT-3514
      containers: /* @ngInject */ (PciStoragesColdArchiveService, projectId) =>
        PciStoragesColdArchiveService.getArchiveContainers(projectId, REGION),

      goToAddColdArchive: /* @ngInject */ ($state, projectId) => () =>
        $state.go('pci.projects.project.storages.cold-archive.add', {
          projectId,
        }),

      goToColdArchiveContainers: ($state, projectId, CucCloudMessage) => (
        message = false,
        type = 'success',
      ) => {
        const reload = message && type === 'success';
        const state = COLD_ARCHIVE_STATES.ROOT;

        const promise = $state.go(
          state,
          {
            projectId,
          },
          {
            reload,
          },
        );

        if (message) {
          promise.then(() =>
            CucCloudMessage[type](message, COLD_ARCHIVE_STATES.CONTAINERS),
          );
        }

        return promise;
      },

      trackClick: /* @ngInject */ (atInternet) => (hit) =>
        atInternet.trackClick({
          name: `${COLD_ARCHIVE_TRACKING.CLICK_PREFIX}::${hit}`,
          type: 'action',
        }),

      trackPage: /* @ngInject */ (atInternet) => (hit) =>
        atInternet.trackPage({
          name: `${COLD_ARCHIVE_TRACKING.CLICK_PREFIX}::${hit}`,
          type: 'navigation',
        }),

      scrollToTop: /* @ngInject */ ($anchorScroll, $location) => () => {
        $location.hash('cold-archive-header');
        $anchorScroll();
      },
    },
  });
};
