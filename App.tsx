import React, { useEffect, useState } from 'react';
import { StyleSheet, Dimensions, View, Animated, ActivityIndicator } from 'react-native';
import { scale } from 'react-native-size-matters';
import { StarScrollView } from './src/starScrollView';
import { TouchableStarLogo } from './src/touchableStarLogo';
import { movie } from './src/types';
import { useInitialFetch, useFetchChars } from './src/fetching';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const App = (): JSX.Element => {
  const [stars, setStars] = useState<number[][]>([]);
  const [movieToShow, setMovieToShow] = useState<movie | null>(null);
  const [currentlyOnMovie, setCurrentlyOnMovie] = useState<movie | null>(null);
  const [menuOpacity] = useState(new Animated.Value(3));
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const movies = useInitialFetch(setIsLoading);
  const [characters, getCharacters] = useFetchChars();

  // generation of the stars in the background
  useEffect(() => {
    const newStars = [];
    for (let i = 0; i < 60; i++) {
      newStars.push([
        Math.random() * screenWidth,
        Math.random() * screenHeight,
        Math.random() * scale(1.8) + scale(1),
        (Math.random() + 1) / 2,
      ]);
    }
    setStars(newStars);
  }, []);

  // animation when changing betwwen movies screen and opning crawl screen
  useEffect(() => {
    if (movieToShow && !currentlyOnMovie) {
      void getCharacters(movieToShow);
      Animated.timing(menuOpacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => setCurrentlyOnMovie(movieToShow));
    } else if (!movieToShow && currentlyOnMovie) {
      Animated.timing(menuOpacity, {
        toValue: 3,
        duration: 500,
        useNativeDriver: true,
      }).start(() => setCurrentlyOnMovie(null));
    }
  }, [movieToShow, currentlyOnMovie]);

  return (
    <View style={styles.rootContainer}>
      {stars.map((el, i) => (
        <View
          key={i}
          style={[
            styles.star,
            {
              width: el[2],
              height: el[2],
              top: el[1],
              left: el[0],
              opacity: el[3],
            },
          ]}
        />
      ))}
      {!isLoading && movies && (
        <Animated.ScrollView
          style={[
            styles.container,
            {
              opacity: menuOpacity.interpolate({
                inputRange: [1.7, 3],
                outputRange: [0, 1],
                extrapolate: 'clamp',
              }),
            },
          ]}
          contentContainerStyle={styles.moviesListInside}>
          {movies?.map((movie) => (
            <TouchableStarLogo
              key={movie?.episode_id}
              episodeNumber={movie?.episode_id}
              subtitle={movie?.title}
              style={styles.movieLogo}
              onPress={() => setMovieToShow(movie)}
            />
          ))}
        </Animated.ScrollView>
      )}
      {!isLoading && (movieToShow || currentlyOnMovie) && (
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            {
              opacity: menuOpacity.interpolate({
                inputRange: [0, 1.3],
                outputRange: [1, 0],
                extrapolate: 'clamp',
              }),
            },
          ]}>
          <StarScrollView
            movie={currentlyOnMovie || movieToShow}
            onBack={() => setMovieToShow(null)}
            characters={characters}
          />
        </Animated.View>
      )}
      {isLoading && (
        <ActivityIndicator style={StyleSheet.absoluteFill} size="large" color="yellow" />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  rootContainer: {
    width: '100%',
    flex: 1,
    backgroundColor: 'black',
  },
  container: {
    width: '100%',
    flex: 1,
  },
  star: {
    position: 'absolute',
    backgroundColor: 'white',
    borderRadius: 999,
  },
  moviesListInside: {
    paddingVertical: scale(50),
    alignItems: 'center',
  },
  movieLogo: {
    marginBottom: scale(20),
  },
});

export default App;
