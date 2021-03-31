const path = require('path');
const xlsx = require('node-xlsx').default;
const firebase = require('firebase');
const firebaseConfig = require('../src/config/firebase');

require('firebase/firestore');

firebase.initializeApp(firebaseConfig);

const doc = firebase.firestore().collection('challenges').doc('aEWqqHD45Eh7DW8vEOQX');

function createDatabaseObject(workSheet) {
  const m = [];

  workSheet.slice(1, workSheet.length).forEach(v => {
    const o = {};

    v.forEach((v, i) => {
      const k = workSheet[0][i];
      o[k] = v;
    });

    m.push(o);
  });

  return m;
}

const points = createDatabaseObject(
  xlsx.parse(path.join(__dirname, '/data/default_points.xlsx'))[0].data,
);

doc.set({
  title: 'Liepāja',
  thumbnailURL: '',
  points,
});
