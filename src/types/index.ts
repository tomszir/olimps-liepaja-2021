import { StyledComponent } from 'styled-components';

export type StyledObject = { [k: string]: StyledComponent<any, any> };

export type ChallengeData = {
  id: string;
  title: string;
  thumbnailURL: string;
  points: ChallengePoint[];
  author: string;
};

export type PointQuestion = {
  question: string;
  correctAnswer: string;
  incorrectAnswers: string[];
};

export type ChallengePoint = {
  title: string;
  description: string;
  lat: number;
  lng: number;
  image_url: string;
  video_url: string;
  address: string;
  questions: PointQuestion[];
  comments: Comment[] | null;
};
export type Comment = {
  author: UserData;
  message: string;
};

export type UserData = {
  id: string;
  displayName: string;
  photoURL: string;
};

export type GameState = {
  turn: number;
  score: number;
  time: number;
  points: ChallengePoint[];
  visitedPoints: { answeredCorrectly: boolean; point: ChallengePoint }[];
  currentPosition: [number, number];
  selectedPoint: ChallengePoint | null;
  activeQuestion: PointQuestion | null;
  activeQuestionShuffle: string[];
  activeQuestionAnswer: number;
  ended: boolean;
};

export type Partial<T> = {
  [P in keyof T]?: T[P];
};
