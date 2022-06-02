import { Method, Feature } from '@wh/request';

export default [
  {
    name: 'FetchUsers',
    url: '/api/user',
    method: Method.GET,
    tag: 'User',
    feature: ['ConsoleParams'],
    afterResponse(response, service, requestParams, action) {
      const { commit } = action;
      commit('Save', {
        users: response.data,
      });
    },
  },
  {
    name: 'CreateUser',
    url: '/api/user',
    method: Method.POST,
    tag: ['User'],
  },
  {
    name: 'UpdateUser',
    url: '/api/user/:id',
    method: Method.PUT,
    tag: ['User'],
  },
  {
    name: 'DeleteUser',
    url: '/api/user/:id',
    method: Method.DELETE,
    tag: ['User'],
  },
  {
    name: 'Login',
    url: '/api/user/login',
    method: Method.POST,
    feature: Feature.useToken,
    tag: ['auth'],
  },
];
