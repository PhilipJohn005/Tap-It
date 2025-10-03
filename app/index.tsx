import { Text, View, StyleSheet, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState, useRef } from 'react';
import Animated, { useSharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';

const adUnitId = TestIds.BANNER; // replace with real id in production

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
//const adUnitId =Platform.OS === 'ios'? 'ca-app-pub-3226104979586723/2176433083': 'ca-app-pub-3226104979586723/5799767722';
// rope length depends on screen width
const ROPE_LENGTH = screenWidth * 0.6;
const WIN_THRESHOLD = screenWidth * 0.3;

// scale utility (responsive text + buttons)
const scale = screenWidth / 400;

export default function Index() {
const [player1Force, setPlayer1Force] = useState(0);
const [player2Force, setPlayer2Force] = useState(0);
const [player1score, setPlayer1Score] = useState(0);
const [player2score, setPlayer2Score] = useState(0);
const [ropeOffset, setRopeOffset] = useState(0);
const [gameWinner, setGameWinner] = useState<null | string>(null);
const forceDecayInterval = useRef<ReturnType<typeof setInterval> | null>(null);

const p1Height = useSharedValue(0);
const p2Height = useSharedValue(0);

const p1Style = useAnimatedStyle(() => ({
height: `${p1Height.value}%`,
}));

const p2Style = useAnimatedStyle(() => ({
height: `${p2Height.value}%`,
}));

useEffect(() => {
const scoreDiff = player1score - player2score;
const newOffset = scoreDiff * -3;
setRopeOffset(newOffset);

if (newOffset <= -WIN_THRESHOLD) {
  setGameWinner('Player 1');
} else if (newOffset >= WIN_THRESHOLD) {
  setGameWinner('Player 2');
}

}, [player1score, player2score]);

useEffect(() => {
forceDecayInterval.current = setInterval(() => {
setPlayer1Force(prev => Math.max(0, prev - 2));
setPlayer2Force(prev => Math.max(0, prev - 2));
p1Height.value = Math.min(100, (player1Force / 20) * 100);
p2Height.value = Math.min(100, (player2Force / 20) * 100);
}, 10);

return () => {
  if (forceDecayInterval.current) clearInterval(forceDecayInterval.current);
};

}, [player1Force, player2Force]);

const handlePlayer1Click = () => {
if (gameWinner) return;
setPlayer1Score(prev => prev + 1);
setPlayer1Force(prev => prev + 3);
p1Height.value = Math.min(100, (player1Force / 20) * 100);
};

const handlePlayer2Click = () => {
if (gameWinner) return;
setPlayer2Score(prev => prev + 1);
setPlayer2Force(prev => prev + 3);
p2Height.value = Math.min(100, (player2Force / 20) * 100);
};

const handleReset = () => {
setPlayer1Score(0);
setPlayer2Score(0);
setRopeOffset(0);
setGameWinner(null);
p1Height.value = 0;
p2Height.value = 0;
};

return ( <View style={styles.container}> <StatusBar style="dark" />

  {/* Banner Ad */}
  <View style={styles.bannerContainer}>
    <BannerAd
      unitId={adUnitId}
      size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
      requestOptions={{ requestNonPersonalizedAdsOnly: true }}
    />
  </View>

  {/* Header */}
  <View style={styles.header}>
    <View style={styles.scoreContainer}>
      <Text style={[styles.playerName, { color: '#3B82F6' }]}>Player 1</Text>
      <Text style={[styles.scoreStyle, { color: '#3B82F6' }]}>{player1score}</Text>
    </View>

    <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
      <Text style={{ color: '#ecedeeff', fontSize: 14 * scale }}>Reset</Text>
    </TouchableOpacity>

    <View style={styles.scoreContainer}>
      <Text style={[styles.playerName, { color: '#EF4444' }]}>Player 2</Text>
      <Text style={[styles.scoreStyle, { color: '#EF4444' }]}>{player2score}</Text>
    </View>
  </View>

  {/* Game Area */}
  <View style={styles.gameArea}>
    <View style={styles.forceIndicator}>
      <View style={styles.forcebar}>
        <Animated.View style={[styles.forceLevel, { backgroundColor: '#3B82F6' }, p1Style]} />
      </View>

      <Text style={[{ color: '#f3e6e6ff', fontSize: 12 * scale }]}>
        Only 1 Finger!!!!
      </Text>

      <View style={styles.forcebar}>
        <Animated.View style={[styles.forceLevel, { backgroundColor: '#EF4444' }, p2Style]} />
      </View>
    </View>

    <View style={styles.ropeArea}>
      <View style={styles.centerLine} />
      <View style={[styles.rope, { transform: [{ translateX: ropeOffset }] }]} />
    </View>

    {gameWinner && (
      <Text style={styles.winnerText}>🎉 {gameWinner} Wins!</Text>
    )}
  </View>

  {/* Controls */}
  <View style={styles.controlsContainer}>
    <TouchableOpacity
      style={[styles.playerButton, { backgroundColor: '#3B82F6' }]}
      activeOpacity={0.7}
      onPress={handlePlayer1Click}
    >
      <Text style={{ color: '#fff', fontSize: 18 * scale }}>TAP!</Text>
      <Text style={{ color: '#fff', fontSize: 14 * scale }}>Player 1</Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={[styles.playerButton, { backgroundColor: '#EF4444' }]}
      activeOpacity={0.7}
      onPress={handlePlayer2Click}
    >
      <Text style={{ color: '#fff', fontSize: 18 * scale }}>TAP!</Text>
      <Text style={{ color: '#fff', fontSize: 14 * scale }}>Player 2</Text>
    </TouchableOpacity>
  </View>
</View>
);
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  bannerContainer: {
  width: '100%',
  alignItems: 'center',
  marginVertical: 5,
  },
  header: {
  flexDirection: 'row',
  backgroundColor: '#4b65a2ff',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingHorizontal: 20,
  paddingVertical: 10,
  },
  scoreContainer: { alignItems: 'center' },
  resetButton: {
  backgroundColor: '#374151',
  paddingHorizontal: 15,
  paddingVertical: 8,
  borderRadius: 20,
  },
  playerName: { fontSize: 16 * scale, fontWeight: '600', marginBottom: 5 },
  scoreStyle: { fontSize: 26 * scale, fontWeight: 'bold' },
  gameArea: {
  flex: 1,
  paddingHorizontal: 20,
  paddingTop: 20,
  },
  forceIndicator: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 10,
  },
  forcebar: {
  backgroundColor: '#35383fff',
  height: screenHeight * 0.15,
  width: screenWidth * 0.05,
  borderRadius: 20,
  overflow: 'hidden',
  },
  forceLevel: {
  width: '100%',
  borderBottomLeftRadius: 20,
  borderBottomRightRadius: 20,
  },
  ropeArea: {
  height: 40,
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  },
  rope: {
  width: ROPE_LENGTH,
  height: 10,
  backgroundColor: '#e4e8efff',
  borderRadius: 5,
  zIndex: 1,
  },
  centerLine: {
  position: 'absolute',
  width: 2,
  height: 40,
  backgroundColor: 'red',
  zIndex: 0,
  },
  winnerText: {
  textAlign: 'center',
  fontSize: 22 * scale,
  fontWeight: 'bold',
  marginVertical: 20,
  color: '#facc15',
  },
  controlsContainer: {
  flexDirection: 'row',
  justifyContent: 'space-evenly',
  marginBottom: 20,
  },
  playerButton: {
  borderRadius: 10,
  width: screenWidth * 0.4,
  height: screenHeight * 0.25,
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.3,
  shadowRadius: 4.65,
  elevation: 8,
},
});
