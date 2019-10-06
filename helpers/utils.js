const DateTime = require('./datetime');

const cleanWhiteSpace = text => {
  return text ? text.replace(/[\n]/g, ' ').replace(/\s+/g, ' ') : text;
};

const formatData = data => {
  const now = DateTime.now();
  let formattedData = {
    name: '',
    detail: '',
    picture_url: '',
    price: 0,
    category: '',
    created_at: '',
    updated_at: ''
  };

  if (data && data.name) {
    formattedData.name = data.name;
  }

  if (data && data.detail) {
    formattedData.detail = data.detail;
  }

  if (data && data.picture_url) {
    formattedData.picture_url = data.picture_url;
  }

  if (data && data.price) {
    formattedData.price = data.price;
  }

  if (data && data.category) {
    formattedData.category = data.category.join(',');
  }

  formattedData.created_at = now;
  formattedData.updated_at = now;

  return formattedData;
};

module.exports = { cleanWhiteSpace, formatData };
