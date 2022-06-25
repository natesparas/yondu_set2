'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db, callback) {
  db.createTable('users', {
    id: { type: 'int', notNull: true, primaryKey: true, autoIncrement: true },
    firstName: { type: 'string', length: 100, notNull: false },
    lastName: { type: 'string', length: 100, notNull: false },
    address: { type: 'string', length: 100, notNull: false },
    postCode: { type: 'string', length: 100, notNull: false },
    phoneNumber: { type: 'string', length: 50, notNull: false },
    Email: { type: 'string', length: 100, notNull: false },
    username: { type: 'string', length: 100, notNull: false },
    password: { type: 'string', length: 100, notNull: false },
  }, callback);
};

exports.down = function(db) {
  return db.dropTable('users');
};

exports._meta = {
  "version": 1
};
