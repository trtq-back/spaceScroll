import React from 'react';
import { useState } from 'react';

import { StyleSheet, Text, View, Animated, Dimensions, TouchableOpacity } from 'react-native';
import { scale } from 'react-native-size-matters';
import { character, movie } from './types';
import { romanize } from './utils';

const { height: screenHeight } = Dimensions.get('window');
const amountSlowed = 3; //change to make scroll faster or slower

type starScrollProps = {
  movie: movie | null;
  onBack: () => void;
  characters?: character[] | null;
};

export const StarScrollView = ({ movie, onBack, characters }: starScrollProps): JSX.Element => {
  const [scrollY] = useState(new Animated.Value(0));
  const [textHeight, setTextHeight] = useState(screenHeight);
  const scrollSlowed = scrollY.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1 / amountSlowed],
  });
  return (
    <View style={styles.container}>
      <Animated.Text
        style={[
          styles.infoText,
          {
            opacity: scrollSlowed.interpolate({
              inputRange: [0, scale(10)],
              outputRange: [1, 0],
              extrapolate: 'clamp',
            }),
          },
        ]}>
        Swipe up!
      </Animated.Text>
      <Animated.View
        style={[
          styles.logoWrap,
          {
            transform: [
              {
                scale: scrollSlowed.interpolate({
                  inputRange: [0, screenHeight],
                  outputRange: [1, 0],
                  extrapolate: 'clamp',
                }),
              },
            ],
          },
        ]}>
        <Text style={styles.logo}>STAR{'\n'}WARS</Text>
      </Animated.View>

      <Animated.View
        style={[
          styles.mainText,
          {
            transform: [
              { perspective: 650 },
              { rotateX: '50deg' },
              {
                translateY: scrollSlowed.interpolate({
                  inputRange: [screenHeight, screenHeight + 1],
                  outputRange: [screenHeight, screenHeight - 1],
                  extrapolateLeft: 'clamp',
                  extrapolateRight: 'extend',
                }),
              },
            ],
          },
        ]}>
        <View
          onLayout={(e) => {
            setTextHeight(e?.nativeEvent?.layout?.height);
          }}>
          <Text style={styles.episodeNum}>Episode {romanize(movie?.episode_id)}</Text>
          <Text style={styles.movieTitle}>{movie?.title}</Text>
          <Text style={styles.text}>{movie?.opening_crawl?.replace(/(\r\n|\n|\r)/gm, ' ')}</Text>
          <Text style={styles.charactersList}>
            CHARACTERS
            {characters?.map(
              (character) =>
                `\n${character.name}${character.specie ? ` (${character.specie})` : ''}`,
            )}
          </Text>
        </View>
      </Animated.View>
      <Animated.ScrollView
        decelerationRate="fast"
        style={StyleSheet.absoluteFill}
        onScroll={Animated.event(
          [
            {
              nativeEvent: {
                contentOffset: { y: scrollY },
              },
            },
          ],
          {
            useNativeDriver: true,
          },
        )}
        scrollEventThrottle={16}>
        <View style={{ height: (textHeight + screenHeight * 5) * amountSlowed }} />
      </Animated.ScrollView>
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <View style={styles.backButtonVerStick} />
        <View style={styles.backButtonHorStick} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  logoWrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    color: 'yellow',
    fontFamily: 'StarJediHollow',
    width: '100%',
    textAlign: 'center',
    fontSize: scale(100),
    lineHeight: scale(105),
  },
  text: {
    color: 'yellow',
    fontFamily: 'News Gothic',
    width: '100%',
    textAlign: 'justify',
    fontSize: scale(14),
  },
  infoText: {
    width: '100%',
    textAlign: 'center',
    color: 'yellow',
    fontFamily: 'News Gothic',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: scale(50),
    fontSize: scale(20),
  },
  mainText: {
    width: '100%',
    height: scale(650),
    overflow: 'visible',
    paddingHorizontal: '25%',
  },
  episodeNum: {
    color: 'yellow',
    fontFamily: 'News Gothic',
    width: '100%',
    textAlign: 'center',
    fontSize: scale(15),
    marginBottom: scale(4),
  },
  movieTitle: {
    color: 'yellow',
    fontFamily: 'News Gothic',
    width: '100%',
    textAlign: 'center',
    textTransform: 'uppercase',
    fontSize: scale(17),
    marginBottom: scale(4),
  },
  charactersList: {
    color: 'yellow',
    fontFamily: 'News Gothic',
    width: '100%',
    textAlign: 'center',
    fontSize: scale(14),
    marginTop: scale(15),
  },
  backButton: {
    position: 'absolute',
    top: scale(40),
    left: scale(20),
    borderRadius: 9999,
    borderWidth: scale(1),
    borderColor: 'yellow',
    alignItems: 'center',
    justifyContent: 'center',
    width: scale(26),
    height: scale(26),
    overflow: 'hidden',
    transform: [{ rotate: '45deg' }],
    opacity: 0.8,
  },
  backButtonVerStick: {
    position: 'absolute',
    top: scale(5),
    bottom: scale(5),
    left: scale(11),
    right: scale(11),
    backgroundColor: 'yellow',
  },
  backButtonHorStick: {
    position: 'absolute',
    top: scale(11),
    bottom: scale(11),
    left: scale(5),
    right: scale(5),
    backgroundColor: 'yellow',
  },
});
