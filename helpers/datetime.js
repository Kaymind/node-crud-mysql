const moment = require('moment-timezone');

const now = () => moment().format('YYYY-MM-DD HH:mm:ss');
const toDate = datetime => moment(datetime).toDate();
const toFormat = (datetime, format) => moment(datetime).format(format);

module.exports = {
  now,
  toDate,
  toFormat
};
