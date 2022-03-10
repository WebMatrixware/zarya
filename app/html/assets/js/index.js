'use strict';

let address;

if (env.port === '80') {
  address = `http://${env.host}`;
} else {
  address = `http://${env.host}:${env.port}`;
}

let set = function set(data) {
  if (typeof(data) === 'undefined' || data === null) {
    return '';
  } else {
    return data.toString();
  }
};

function setMemory(data) {

   if(data === null || typeof(data) === 'undefined') {
     return 0;
   } else {
     return data / 1024;
   }
};

function setDrive(data) {

   if(data === null || typeof(data) === 'undefined') {
     return 0;
   } else {
     return data / 1024 / 1024 /1024;
   }
};

let getVMList = async function getVMList() {

  let token = await getToken();

  return await superagent
    .get(`${address}/vmlist`)
    .set('token', token)
    .then((res) => {
      res.body.forEach(async (h) => {
        let v = new vm(h);
        let drives = await superagent
          .get(`${address}/${v.vm_id()}/vmdrives`)
          .set('token', token)
          .then((res) => {
            res.body.forEach(async (d) => {
              let disk = new drive(d.key, d.value.capacity, d.value.free_space);
              v.drives.push(disk);
            });
          }, (err) => {
            if (err.status === 503) {
              console.error('vmTools is not insalled');
            } else {
              console.error(err);
            }
          });
        viewm.vms.push(v);
      });
    }, (err) => {
      console.error(err);
    });
};

let getToken = async function getToken() {

  return await superagent
    .get(`${address}/token`)
    .then((res) => {
      return res.text;
    }, (err) => {
      console.error(err);
    });
};

function vm(data) {

  let self = this;

  self.memory = ko.observable(setMemory(data.memory_size_MiB));
  self.vm_id = ko.observable(set(data.vm));
  self.name = ko.observable(set(data.name));
  self.power = ko.observable(set(data.power_state));
  self.cores = ko.observable(set(data.cpu_count));
  self.drives = ko.observableArray([]);
  self.bgColor = ko.computed(function() {
    switch(self.power()) {
      case 'POWERED_OFF':
        return 'bg-danger';
      case 'POWERED_ON':
        return 'bg-success';
      case 'SUSPENDED':
        return 'bg-warning';
      default:
       return 'bg-secondary';
    }
  });
};

function drive(name, size, free) {

  let self = this;

  self.name = ko.observable(name);
  self.size = ko.observable(setDrive(size));
  self.free = ko.observable(setDrive(free));
};

function viewModel() {

  let self = this;

  self.vms = ko.observableArray([]);
  self.totalCores = ko.computed(function() {
    let c = 0;

    self.vms().forEach((v) => {

      c += (v.cores() * 1);
    });

    return c;
  });
  self.totalMemory = ko.computed(function() {
    let m = 0;

    self.vms().forEach((v) => {

      m += (v.memory() * 1);
    });

    return m;
  });
  self.totalVMs = ko.computed(function() {
    return self.vms().length;
  });
  self.totalDisk = ko.computed(function() {
    let d = 0;

    self.vms().forEach((v) => {
      v.drives().forEach((disk) => {
        d += (disk.size() * 1);
      });
    });

    return d;
  });
};

let viewm = new viewModel();
let editor;

ko.applyBindings(viewm);

$(document).ready(async function () {
  getVMList();
});
