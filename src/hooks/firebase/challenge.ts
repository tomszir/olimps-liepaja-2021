import { useState, useEffect } from 'react';

import firebase, { firestore, storage } from '@/firebase';
import { ChallengeData } from '@/types';

const dataToChallenge = (id: string, data: firebase.firestore.DocumentData) => {
  return Object.assign({}, { id }, data) as ChallengeData;
};

export const useChallenge = (id: string) => {
  const [isLoading, toggleLoading] = useState<boolean>(true);
  const [challenge, setChallenge] = useState<ChallengeData | null>(null);

  const fetchChallenge = async () => {
    const response = firestore.collection('challenges').doc(id);
    const document = await response.get();
    const challenge = dataToChallenge(
      id,
      document.data() as firebase.firestore.DocumentData,
    );

    setChallenge(challenge);
    toggleLoading(false);
  };

  useEffect(() => {
    fetchChallenge();
  }, []);

  return { challenge, isLoading };
};

export const useChallenges = (userId?: string) => {
  const [isLoading, toggleLoading] = useState<boolean>(true);
  const [challenges, setChallenges] = useState<ChallengeData[]>([]);

  const fetchChallenges = async () => {
    const response = firestore.collection('challenges');
    const data = await response.get();

    let challenges = data.docs.map(document => {
      return dataToChallenge(
        document.id,
        document.data() as firebase.firestore.DocumentData,
      );
    });

    if (userId) {
      challenges = challenges.filter(({ author }) => author == userId);
    }

    setChallenges(challenges);
    toggleLoading(false);
  };

  useEffect(() => {
    fetchChallenges();
  }, []);

  return { challenges, fetchChallenges, isLoading };
};

const handleFileUpload = async (namespace: string, file: File) => {
  const storageRef = storage.ref(namespace + file.name);
  const snapshot = await storageRef.put(file);
  const url = await snapshot.ref.getDownloadURL();

  return url;
};

export const getThumbnailURL = (namespace: string, thumbnail?: File | string) => {
  if (!thumbnail) {
    return '';
  }

  if (typeof thumbnail == 'string') {
    return thumbnail;
  }

  return handleFileUpload(namespace, thumbnail as File);
};

export const useChallengeModifier = () => {
  const collection = firestore.collection('challenges');

  const updateChallenge = async () => {};

  const createChallenge = async (data: {
    title: string;
    thumbnail?: File | string;
    author: string;
  }) => {
    const { title, thumbnail, author } = data;
    const challenge = await collection.add({
      title,
      thumbnailURL: '',
      author,
      points: [],
    });

    const thumbnailURL = await getThumbnailURL(`${challenge.id}/thumbnails/`, thumbnail);

    challenge.update({
      thumbnailURL,
    });

    return challenge;
  };

  return { createChallenge, updateChallenge };
};
