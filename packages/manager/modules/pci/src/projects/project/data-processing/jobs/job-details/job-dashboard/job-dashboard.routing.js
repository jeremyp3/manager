export default /* @ngInject */ ($stateProvider) =>
  $stateProvider.state(
    'pci.projects.project.data-processing.jobs.job-details.dashboard',
    {
      url: '/dashboard',
      component: 'pciProjectDataProcessingJobDetailsDashboard',
      resolve: {
        // retrieve job id from url params
        jobId: /* @ngInject */ ($transition$) => $transition$.params().jobId,
        job: /* @ngInject */ (
          // retrieve job from service
          dataProcessingService,
          projectId,
          jobId,
        ) => dataProcessingService.getJob(projectId, jobId),
        metricsToken: /* @ngInject */ (dataProcessingService, projectId) =>
          dataProcessingService.getMetricsToken(projectId),
        notebooks: /* @ngInject */ (dataProcessingService, projectId) =>
          dataProcessingService.getNotebooks(projectId),
        terminateJob: /* @ngInject */ ($state, projectId, job) => () => {
          $state.go(
            'pci.projects.project.data-processing.jobs.job-details.dashboard.terminate',
            {
              projectId,
              jobId: job.id,
              jobName: job.name,
            },
          );
        },
        showMetrics: /* @ngInject */ ($state, projectId, job) => () => {
          $state.go(
            'pci.projects.project.data-processing.jobs.job-details.dashboard.metrics-token',
            {
              projectId,
              jobId: job.id,
              jobName: job.name,
            },
          );
        },
        showNotebook: /* @ngInject */ ($state, projectId, job) => () => {
          $state.go('pci.projects.project.data-processing.notebooks.details', {
            projectId,
            notebookId: job.notebook,
          });
        },
        showBillingConsole: /* @ngInject */ ($state, projectId) => () => {
          $state.go('pci.projects.project.billing', {
            projectId,
          });
        },
        browseObjectStorage: /* @ngInject */ ($state, projectId) => (
          containerId,
        ) => {
          $state.go(
            'pci.projects.project.storages.object-storage.objects.object',
            {
              projectId,
              containerId,
            },
          );
        },
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('data_processing_details_dashboard_label'), // update breadcrumb with "Dashboard"
      },
      atInternet: {
        name:
          'public-cloud::pci::projects::project::data-processing::job-details::dashboard',
      },
    },
  );
