import controller from './notebook-sizing.controller';
import template from './notebook-sizing.html';

export default {
  template,
  controller,
  bindings: {
    onChangeHandler: '<',
    selectedNotebookSizing: '<',
    selectedClusterSizing: '<',
    projectId: '<',
  },
};
