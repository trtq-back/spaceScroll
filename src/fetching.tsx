import { useEffect, useState } from 'react';
import axios from 'axios';
import { character, movie } from './types';
import { errorHandle } from './utils';

export const useInitialFetch = (setIsLoading: (a: boolean) => void): movie[] | null => {
  const [movies, setMovies] = useState<movie[] | null>(null);

  const getInitialInfo = () => {
    axios
      .get('https://swapi.dev/api/films/')
      .then((results: { status: number; data: { results: movie[] } }) => {
        if (results.status === 200 && results?.data?.results) {
          setMovies(results.data.results);
          setIsLoading(false);
        } else {
          errorHandle(getInitialInfo);
        }
      })
      .catch(() => {
        errorHandle(getInitialInfo);
      });
  };

  useEffect(() => {
    axios
      .get('https://swapi.dev/api/films/')
      .then((results: { status: number; data: { results: movie[] } }) => {
        if (results.status === 200 && results?.data?.results) {
          setMovies(results.data.results);
          setIsLoading(false);
        } else {
          errorHandle(getInitialInfo);
        }
      })
      .catch(() => {
        errorHandle(getInitialInfo);
      });
  }, []);
  return movies;
};

export const useFetchChars = (): [character[] | null, (movie: movie) => void] => {
  const [characters, setCharacters] = useState<character[] | null>(null);

  const getCharacters = async (movie: movie) => {
    setCharacters(null);
    if (movie?.characters) {
      const max = Math.min(movie.characters.length, 5);
      const newCharacters = [];
      for (let i = 0; i < max; i++) {
        const result = await axios.get(movie.characters[i]);
        if (!result || result?.status !== 200) {
          errorHandle(() => void getCharacters(movie));
          break;
        } else if (result?.data) {
          const newChar = { ...(result.data as character) };
          if (newChar?.species?.length > 0) {
            const specie: { status: number; data: { name: string } } = await axios.get(
              newChar.species[0],
            );
            if (!specie || specie?.status !== 200) {
              errorHandle(() => void getCharacters(movie));
              break;
            } else if (specie?.data?.name) {
              newChar.specie = specie?.data?.name;
            }
          }
          newCharacters.push(newChar);
        }
      }
      setCharacters(newCharacters);
    }
  };
  return [characters, getCharacters];
};
