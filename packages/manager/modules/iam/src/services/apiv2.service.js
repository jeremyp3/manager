import { API_ERROR } from '@iam/constants';

export default class Apiv2Service {
  #baseURL = 'iam';

  /* @ngInject */
  constructor($http, $translate) {
    this.$http = $http;
    this.$translate = $translate;
  }

  /**
   * Call the given endpoint on the API v2
   * @param {'get' | 'post' | 'put' | 'delete'} method
   * @param {string} endpoint
   * @param {object=} options the $http options
   * @returns {Promise}
   */
  http(method, endpoint, options) {
    return this.$http({
      ...options,
      method,
      url: `/engine/api/v2/${this.#baseURL}/${endpoint}`,
      serviceType: 'apiv2',
    }).catch((error) => this.parseError(error));
  }

  /**
   * Call the given endpoint on the API v2 using the 'get' method
   * @param {string} endpoint
   * @param {object=} options the $http.get options
   * @returns {Promise}
   */
  get(endpoint, options) {
    return this.http('get', endpoint, options);
  }

  /**
   * Call the given endpoint on the API v2 using the 'get' method
   * @param {string} endpoint
   * @param {object=} options the $http.get options
   * @returns {Promise}
   */
  post(endpoint, options) {
    return this.http('post', endpoint, options);
  }

  /**
   * Call the given endpoint on the API v2 using the 'delete' method
   * @param {string} endpoint
   * @param {object=} options the $http.delete options
   * @returns {Promise}
   */
  delete(endpoint, options) {
    return this.http('delete', endpoint, options);
  }

  /**
   * Call the given list endpoint on the API v2 that implements the cursor api
   * @param {string} endpoint
   * @param {string=} cursor The cursor id
   * @returns {Promise}
   */
  getList(endpoint, { cursor }) {
    const options = cursor
      ? { headers: { 'X-Pagination-Cursor': cursor } }
      : null;
    return this.get(endpoint, options)
      .then(({ data, headers }) => ({
        data,
        cursor: {
          next: headers('X-Pagination-Cursor-Next'),
          prev: headers('X-Pagination-Cursor-Prev'), // not available ATM
        },
      }))
      .catch((error) => {
        if (error.status === 400 && error.data?.message === 'invalid cursor') {
          return { cursor: { error: true } };
        }
        throw error;
      });
  }

  /**
   * Augment the passed error with data that tells on witch entities and witch parameters
   * the error class given by the API applies, and translate each combination of [entity/parameter]
   * that matches this error class
   *
   * For instance the rejected error may contain :
   *
   * data: {
   *   class: 'POLICY_ALREADY_EXISTS',
   *   policy: {
   *     name: 'the translated error',
   *     ...
   *   }
   * }
   *
   * @param {Error} error
   * @throws {Error}
   */
  parseError(error) {
    const { data = {} } = error;
    const klass = data.class?.split('::').pop();

    if (!klass) {
      throw error;
    }

    Object.entries(API_ERROR).forEach(([entity, properties]) => {
      Object.entries(properties).forEach(([property, errors]) => {
        if (errors.includes(klass)) {
          Object.assign(data, {
            [entity.toLowerCase()]: {
              ...(data[entity] ?? {}),
              [property.toLowerCase()]: this.$translate.instant(
                `iam_services_apiv2_error_${entity}_${property}_${klass}`,
              ),
            },
          });
        }
      });
    });

    Object.assign(error, { data: { ...data, class: klass } });
    throw error;
  }
}
