const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const response = require('./response.js');

const hashPassword = async (res, password) => {
  if (password == null) {
    return response.error('Password cannot be empty', res, 500);
  }
  return await bcrypt.hash(password, 10);
};

const validatePassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

const validateToken = (token, secretKey) =>
  jwt.verify(token, secretKey, (err, decoded) => (err ? err : decoded));

function validateEmail(email) {
  var re = /\S+@\S+\.\S+/;
  return re.test(email);
}

function checkPassword(password) {
  if (password.length < 8) {
    return false;
  }
  return true;
}

const yyyyMmDd = (date = new Date()) => {
  return `${date.getFullYear()}-${date.getMonth() < 9 ? '0' : ''}${
    date.getMonth() + 1
  }-${date.getDate() < 10 ? '0' : ''}${date.getDate()}`;
};

const formatDate = (date = new Date()) => {
  const day = `${date.getDate() < 10 ? '0' : ''}${date.getDate()}`;
  const mn = date.getMonth() + 1;
  const month = mn < 10 ? `0${mn}` : mn;
  const year = date.getFullYear();
  const hour = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
  const min =
    date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
  return `${day}/${month}/${year} ${hour}:${min}`;
};

const validateTimeHHMMSS = (time) => {
  const pattern = /(?:[01]\d|2[0-3]):(?:[0-5]\d):(?:[0-5]\d)/;
  return pattern.test(time);
};

const timeStampToTime = (ts) => {
  // ts 5000
  let sec = ts / 1000;
  if (sec < 60) return `00:00:${sec < 10 ? '0' : ''}${sec}`;
  else if (sec < 3600) {
    let m = parseInt(sec / 60);
    let s = sec - m * 60;
    return `00:${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  } else {
    let h = parseInt(sec / 3600);
    sec = sec - h * 3600;
    let m = parseInt(sec / 60);
    let s = sec - m * 60;
    return `${h < 10 ? '0' : ''}${h}:${m < 10 ? '0' : ''}${m}:${
      s < 10 ? '0' : ''
    }${s}`;
  }
};

const timeToTimeStamp = (time) => {
  let hh = time.split(':')[0];
  let mm = time.split(':')[1];
  let ss = time.split(':')[2];
  return (parseInt(hh) * 3600 + parseInt(mm) * 60 + parseInt(ss)) * 1000;
};

const slugify = (str) => {
  str = str.replace(/^\s+|\s+$/g, '');

  // Make the string lowercase
  str = str.toLowerCase();

  // Remove accents, swap ñ for n, etc
  var from = "ÁÄÂÀÃÅČÇĆĎÉĚËÈÊẼĔȆÍÌÎÏŇÑÓÖÒÔÕØŘŔŠŤÚŮÜÙÛÝŸŽáäâàãåčçćďéěëèêẽĕȇíìîïňñóöòôõøðřŕšťúůüùûýÿžþÞĐđßÆa·/_,:;";
  var to = "AAAAAACCCDEEEEEEEEIIIINNOOOOOORRSTUUUUUYYZaaaaaacccdeeeeeeeeiiiinnooooooorrstuuuuuyyzbBDdBAa------";
  for (var i = 0, l = from.length; i < l; i++) {
    str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
  }

  // Remove invalid chars
  str = str.replace(/[^a-z0-9 -]/g, '')
    // Collapse whitespace and replace by -
    .replace(/\s+/g, '-')
    // Collapse dashes
    .replace(/-+/g, '-');

  return str;
}

module.exports = {
  hashPassword,
  validatePassword,
  validateToken,
  validateEmail,
  checkPassword,
  yyyyMmDd,
  validateTimeHHMMSS,
  timeStampToTime,
  timeToTimeStamp,
  formatDate,
  slugify
};
