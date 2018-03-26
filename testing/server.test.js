const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../app');
const river = require('../models/river-model');


beforeEach((done) => {
  river.remove({}).then(() => {
    return river.insertMany(todos);
  }).then(() => done());
});

var add=require('./util');
it('should add two numbers',()=>{
  var res=add(4,5);
})
