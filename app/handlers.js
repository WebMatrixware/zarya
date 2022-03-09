'use strict';

const SA = require('superagent');

let address = `https://${process.env.VMHOST}`

exports.base = async function base(request, h) {

  return h.view('index');
};

exports.vmlist = async function vmlist(request, h) {

  let headers = request.headers;

  console.log('vmlist called');

  return await SA.get(`${address}/rest/vcenter/vm`)
    .set('vmware-api-session-id', headers.token)
    .disableTLSCerts()
    .then((res) => {
      return h.response(res.body.value).code(200);
    }, (err) => {
      console.log(err);
      return h.response(err.toString()).code(500);
    });
};

exports.getVMDrives = async function getVMDrives(request, h) {

  let headers = request.headers;

  console.log('getVMDrives called');
  console.log(headers.token);
  console.log(request.params.vm);

  return await SA.get(`${address}/rest/vcenter/vm/${request.params.vm}/guest/local-filesystem`)
    .set('vmware-api-session-id', headers.token)
    .disableTLSCerts()
    .then((res) => {
      return h.response(res.body.value).code(200);
    }, (err) => {
      console.log(err.status);
      if (err.status === 503) {
        return h.response('vmTools is not installed').code(503);
      } else {
        return h.response('Internal server error').code(err.status);
      }
    });
};

exports.getToken = async function getToken(request, h) {

  console.log('token called');

  return await SA.post(`${address}/rest/com/vmware/cis/session`)
    .set('Authorization', process.env.VMCRED)
    .disableTLSCerts()
    .then((res) => {
      return h.response(res.body.value).code(200);
    }, (err) => {
      console.log(err);
      return h.response(err.toString()).code(500);
    });
};
