const mysql = require('mysql');
const SqlString = require('sqlstring');

const createConnection = configs => {
  const {
    host,
    user,
    pass
  } = configs;
  return mysql.createConnection({
    host,
    user,
    password: pass,
    multipleStatements: true
  });
};

const insert = (connection, database, table, data) => {
  const getQuery = (table, data) => {
    let query = '';

    try {
      const keys = `\`${Object.keys(data).join('`,`')}\``;
      const values = `"${Object.values(data).join('","')}"`;
      query = `USE ${database};INSERT INTO \`${table}\` (${keys}) VALUES (${values})`;
    } catch (error) {
      throw error;
    }

    return query;
  };
  const query = getQuery(table, data);

  return new Promise((resolve, reject) => {
    connection.query(SqlString.format(query), (error, result) => {
      if (error) {
        reject(error);
      }

      resolve(result);
    });
  });
};

const update = (connection, database, table, data) => {
  const getQuery = (table, data) => {
    let query = '';

    try {
      const id = data['id'];
      const list = Object.keys(data).map(key => `\`${key}\` = '${data[key]}'`);
      const values = list.join();
      query = `USE ${database};UPDATE \`${table}\` SET ${values} WHERE \`id\`= '${id}'`;
    } catch (error) {
      throw error;
    }

    return query;
  };
  const query = getQuery(table, data);
  
  return new Promise((resolve, reject) => {
    connection.query(SqlString.format(query), (error, result) => {
      if (error) {
        reject(error);
      }

      resolve(result);
    });
  });
};

const search = (connection, database, table, filter = null) => {
  const getQuery = (table, filter) => {
    let query = '';

    try {
      query = filter ?
        `USE ${database};SELECT * FROM \`${table}\` WHERE ${filter}` :
        `USE ${database};SELECT * FROM \`${table}\``;
    } catch (error) {
      throw error;
    }

    return query;
  };
  const query = getQuery(table, filter);

  return new Promise((resolve, reject) => {
    connection.query(SqlString.format(query), (error, rows) => {
      if (error) {
        reject(error);
      }

      resolve(rows ? rows[1] : []);
    });
  });
};

const deleteSql = (connection, database, table, filter = null) => {
  const getQuery = (table, filter) => {
    let query = '';

    try {
      query = filter ?
        `USE ${database};DELETE FROM \`${table}\` WHERE ${filter}` :
        `USE ${database};DELETE FROM \`${table}\``;
    } catch (error) {
      throw error;
    }

    return query;
  };
  const query = getQuery(table, filter);
  console.log('**********', query)
  return new Promise((resolve, reject) => {
    connection.query(SqlString.format(query), (error, result) => {
      if (error) {
        reject(error);
      }

      resolve(result);
    });
  });
};

module.exports = {
  createConnection,
  insert,
  update,
  search,
  deleteSql
};