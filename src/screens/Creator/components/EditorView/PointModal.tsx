import React, { useState } from 'react';
import { MapContainer, Marker } from 'react-leaflet';
import styled from 'styled-components';

import { firestore } from '@/firebase';
import { StyledObject, ChallengeData, ChallengePoint, PointQuestion } from '@/types';
import { validatePointQuestion } from '@/utils/firebase';

import LeafletMap from '@/components/LeafletMap';
import Button from '@/components/Button';
import { Input, TextArea } from '@/components/Form';
import Modal, { ModalProps } from '@/components/Modal';

import ThumbnailUpload from '../ThumbnailUpload';

const S: StyledObject = {};

S.Label = styled.h5`
  margin-bottom: 10px;
  color: #f1f1f1;
  font-family: 'Poppins', sans-serif;
`;

S.Divider = styled.div`
  height: 10px;
`;

S.InputContainer = styled.div`
  display: flex;

  & > *:not(:first-child) {
    margin-left: 8px;
  }
`;

S.QuestionInputs = styled.div`
  padding-left: 48px;
`;

S.LeafletMap = styled(LeafletMap)`
  width: 100%;
  height: 280px;
  border-radius: 4px;
`;

export type EditorViewPointModalProps = {
  point: ChallengePoint | null;
  challenge: ChallengeData;
  onClose: () => void;
  onCreate: (point: any) => void;
};

const QuestionField: React.FC<{
  pointQuestion?: PointQuestion;
  index: number;
  onChange?: (question: PointQuestion) => void;
}> = ({ pointQuestion, index, onChange }) => {
  const [question, setQuestion] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [incorrectAnswers, setIncorrectAnswers] = useState<string[]>(['', '', '']);

  const handleChange = (q: PointQuestion) => {
    onChange && onChange(q);
  };

  const onQuestionChange = (value: string) => {
    handleChange({
      question: value,
      correctAnswer,
      incorrectAnswers,
    });
    setQuestion(value);
  };

  const onCorrectAnswerChange = (value: string) => {
    handleChange({
      question,
      correctAnswer: value,
      incorrectAnswers,
    });
    setCorrectAnswer(value);
  };

  const onIncorrectAnswerChange = (value: string, index: number) => {
    const a = incorrectAnswers;
    a[index] = value;

    handleChange({
      question,
      correctAnswer,
      incorrectAnswers: a,
    });
    setIncorrectAnswers(a);
  };

  return (
    <div>
      <Input
        label={`#${index + 1}`}
        onChange={v => onQuestionChange(v as string)}
        defaultValue={pointQuestion?.question}
        placeholder='Kā sauc šo vietu?'
      />
      <S.Divider />
      <S.QuestionInputs>
        <Input
          label='Pareizā atbilde'
          onChange={v => onCorrectAnswerChange(v)}
          defaultValue={pointQuestion?.correctAnswer}
          placeholder='Luksofors'
        />
        <S.Divider />
        <Input
          label='Nepareizās atbildes'
          onChange={v => onIncorrectAnswerChange(v, 0)}
          defaultValue={pointQuestion?.incorrectAnswers[0]}
          placeholder='Suns'
        />
        <S.Divider />
        <Input
          onChange={v => onIncorrectAnswerChange(v, 1)}
          defaultValue={pointQuestion?.incorrectAnswers[1]}
          placeholder='Kaķis'
        />
        <S.Divider />
        <Input
          onChange={v => onIncorrectAnswerChange(v, 2)}
          defaultValue={pointQuestion?.incorrectAnswers[2]}
          placeholder='Zirgs'
        />
      </S.QuestionInputs>
    </div>
  );
};

export const EditorViewPointModal: React.FC<EditorViewPointModalProps> = ({
  point,
  challenge,
  onClose,
  onCreate,
  ...props
}) => {
  const [error, setError] = useState('');
  const [title, setTitle] = useState(point?.title || '');
  const [description, setDescription] = useState(point?.description || '');
  const [videoURL, setVideoURL] = useState(point?.video_url || '');
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailURL, setThumbnailURL] = useState(point?.image_url || '');
  const [latitude, setLatitude] = useState<number>(point?.lat || 56.51667);
  const [longitude, setLongitude] = useState<number>(point?.lng || 21.01667);
  const [questions, setQuestions] = useState<(PointQuestion | undefined)[]>(
    !point || !point.questions || point.questions.length == 0
      ? [undefined]
      : point.questions,
  );

  const handleClose = () => {
    onClose();
  };

  const save = async () => {
    const validQuestions = questions.filter(validatePointQuestion);
    const data = Object.assign(
      {},
      point,
      title != '' && { title },
      description != '' && { description },
      videoURL != '' && { video_url: videoURL },
      validQuestions.length > 0 && { questions: validQuestions },
      latitude && { lat: latitude },
      longitude && { lng: longitude },
    );

    const points = challenge.points;

    if (point) {
      points[points.indexOf(point)] = data;
    } else {
      points.push(data);
    }

    firestore.collection('challenges').doc(challenge.id).update({
      points,
    });

    handleClose();
  };

  return (
    <Modal
      title={point ? 'Labot punktu' : 'Izveidot jaunu punktu'}
      isOpen={true}
      onClose={handleClose}
    >
      {error && <div>{error}</div>}
      <Input
        label='Nosaukums'
        onChange={setTitle}
        defaultValue={title}
        placeholder='Punkta nosaukums'
      />
      <S.Divider />
      <S.Label>Atrašanās vieta</S.Label>
      <S.LeafletMap center={[latitude, longitude]}>
        {point?.lat && point?.lng && (
          <Marker key={point.title} position={[latitude, longitude]} />
        )}
      </S.LeafletMap>
      <S.Divider />
      <S.InputContainer>
        <Input
          label='Latitude'
          onChange={v => setLatitude(parseInt(v))}
          defaultValue={latitude}
          placeholder='0'
        />
        <Input
          label='Longitude'
          onChange={v => setLongitude(parseInt(v))}
          defaultValue={longitude}
          placeholder='0'
        />
      </S.InputContainer>
      <S.Divider />
      <Input
        label='Adrese'
        onChange={setTitle}
        defaultValue={point?.address}
        placeholder=''
      />
      <S.Divider />
      <S.Label>Attēls</S.Label>
      <ThumbnailUpload url={thumbnailURL} onUpload={setThumbnail} />
      <S.Divider />
      <Input
        label='Video URL'
        onChange={setVideoURL}
        defaultValue={videoURL}
        placeholder='https://youtube.com/'
      />
      <S.Divider />
      <TextArea
        label='Apraksts'
        onChange={setDescription}
        defaultValue={description}
        placeholder='Lorem ipsum'
      />
      <S.Divider />
      <S.Label>Jautājumi</S.Label>
      {questions.map((q, i) => {
        return (
          <QuestionField
            pointQuestion={q}
            key={i}
            index={i}
            onChange={v => {
              const q = questions;
              q[i] = v;
              setQuestions(q);
            }}
          />
        );
      })}
      <S.Divider />
      <Button
        label='Pievienot'
        onClick={() => {
          setQuestions([...questions, undefined]);
        }}
      />
      <S.Divider />
      <Button label='Saglabāt' type='primary' onClick={save} />
    </Modal>
  );
};

export default EditorViewPointModal;
