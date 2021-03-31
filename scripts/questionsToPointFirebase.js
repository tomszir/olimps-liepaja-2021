const path = require('path');
const xlsx = require('node-xlsx').default;
const firebase = require('firebase');
const firebaseConfig = require('../src/config/firebase');

require('firebase/firestore');

firebase.initializeApp(firebaseConfig);

const doc = firebase.firestore().collection('challenges').doc('aEWqqHD45Eh7DW8vEOQX');

const get = async () => {
  const points = (await doc.get()).data().points;

  const worksheet = xlsx.parse(path.join(__dirname, '/data/questions_liepaja.xlsx'))[0]
    .data;

  worksheet.slice(1, worksheet.length).forEach((row, index) => {
    const filtered = row.slice(1, row.length).filter(v => v !== '-');
    const chunks = [];
    const questions = [];

    for (let i = 0; i < filtered.length; i += 6) {
      chunks.push(filtered.slice(i, i + 6));
    }

    chunks.forEach(chunk => {
      const question = chunk[0];
      const correctAnswer = chunk[chunk[5] + 1];
      const incorrectAnswers = chunk.filter(
        (_, i) => i != 0 && i != chunk[5] + 1 && i != 5,
      );

      questions.push({
        question,
        correctAnswer,
        incorrectAnswers,
      });
    });

    points[index] = Object.assign({}, points[index], { questions });

    console.log(questions);
  });

  doc.update({ points });
};

get();

/*
const points = createPointsWithQuestions(
  xlsx.parse(path.join(__dirname, '/data/questions_liepaja.xlsx'))[0].data,
);
*/

/*
doc.set({
  title: 'Liepāja',
  thumbnailURL: '',
  points,
});*/
