'use strict';

const Handlers = require('./handlers.js');
const Joi = require('@hapi/joi');
const Path = require('path');

module.exports = {
  register: async (server, options) => {
    server.route([
      {
        method: 'GET',
        path: '/assets/{path*}',
        handler: {
          directory: {
            path: Path.join(__dirname, 'html', 'assets'),
            listing: false,
            index: false
          }
        },
        options: {
          description: 'Serve static asset files',
          id: 'assetsRoute',
          tags: ['get', 'assets']
        }
      },
      {
        method: 'GET',
        path: '/modules/{path*}',
        handler: {
          directory: {
            path: Path.join(__dirname, 'html', 'node_modules'),
            listing: false,
            index: false
          }
        },
        options: {
          description: 'Serve static module files',
          id: 'modulesRoute',
          tags: ['get', 'modules']
        }
      },
      {
        method: 'GET',
        path: '/{param*}',
        handler: Handlers.base,
        options: {
          description: 'Default route',
          id: 'base',
          tags: ['get']
        }
      },
      {
        method: 'GET',
        path: '/vmlist',
        handler: Handlers.vmlist,
        options: {
          description: 'vmlist',
          id: 'vmlist',
          tags: ['get']
        }
      },
      {
        method: 'GET',
        path: '/{vm}/vmdrives',
        handler: Handlers.getVMDrives,
        options: {
          description: 'Get list of VM drives',
          id: 'getVMDrives',
          tags: ['get']
        }
      },
      {
        method: 'GET',
        path: '/token',
        handler: Handlers.getToken,
        options: {
          description: 'token',
          id: 'token',
          tags: ['get']
        }
      }
    ]);
  },
  name: 'routes',
  version: '0.1.0'
};
