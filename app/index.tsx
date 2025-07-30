import { Text, View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState,useRef } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';

const { width: screenWidth } = Dimensions.get('window');
const ROPE_LENGTH = screenWidth * 0.6;
const WIN_THRESHOLD = screenWidth * 0.3;

export default function Index() {
  const [player1Force, setPlayer1Force] = useState(0);
  const [player2Force, setPlayer2Force] = useState(0);
  const [player1score,setPlayer1Score]=useState(0);
  const [player2score,setPlayer2Score] = useState(0);
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
    // Force decay over time
    forceDecayInterval.current = setInterval(() => {
      setPlayer1Force(prev => Math.max(0, prev - 2));
      setPlayer2Force(prev => Math.max(0, prev - 2));
      p1Height.value = Math.min(100, (player1Force / 20) * 100);
      p2Height.value = Math.min(100, (player2Force / 20) * 100);
    }, 10);

    return () => {
      if (forceDecayInterval.current) {
        clearInterval(forceDecayInterval.current);
      }
    };
  }, [player1Force, player2Force]);

  const handlePlayer1Click = () => {
    if (gameWinner) return;
    setPlayer1Score(prev => prev + 1);
    setPlayer1Force(prev=>prev+3);
    p1Height.value = Math.min(100, (player1Force / 20) * 100);
  };

  const handlePlayer2Click = () => {
    if (gameWinner) return;
    setPlayer2Score(prev => prev + 1);
    setPlayer2Force(prev=>prev+3);
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

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <View style={styles.scoreContainer}>
          <Text style={[styles.playerName, { color: '#3B82F6' }]}>Player 1</Text>
          <Text style={[styles.scoreStyle, { color: '#3B82F6' }]}>{player1score}</Text>
        </View>

        <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
          <Text style={{ color: '#ecedeeff' }}>Reset</Text>
        </TouchableOpacity>

        <View style={styles.scoreContainer}>
          <Text style={[styles.playerName, { color: '#EF4444' }]}>Player 2</Text>
          <Text style={[styles.scoreStyle, { color: '#EF4444' }]}>{player2score}</Text>
        </View>
      </View>

      <View style={styles.gameArea}>
        <View style={styles.forceIndicator}>
          <View style={styles.forcebar}>
            <Animated.View style={[styles.forceLevel, { backgroundColor: '#3B82F6' }, p1Style]} />
          </View>
          <Text style={[{color:'#f3e6e6ff'}]}>
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
          <Text style={styles.winnerText}>
            🎉 {gameWinner} Wins!
          </Text>
        )}

        
      </View>
      <View style={styles.controlsContainer}>
          <TouchableOpacity
            style={[styles.playerButton, { backgroundColor: '#3B82F6' }]}
            activeOpacity={0.7}
            onPress={handlePlayer1Click}
          >
            <Text style={{ color: '#fff' }}>TAP!</Text>
            <Text style={{ color: '#fff' }}>Player 1</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.playerButton, { backgroundColor: '#EF4444' }]}
            activeOpacity={0.7}
            onPress={handlePlayer2Click}
          >
            <Text style={{ color: '#fff' }}>TAP!</Text>
            <Text style={{ color: '#fff' }}>Player 2</Text>
          </TouchableOpacity>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#0F172A' ,
    paddingBottom:50
  },
  header: {
    flexDirection: 'row',
    backgroundColor: '#4b65a2ff',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60
  },
  scoreContainer: { alignItems: 'center' },
  resetButton: {
    backgroundColor: '#374151',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  playerName: { fontSize: 18, fontWeight: '600', marginBottom: 5 },
  scoreStyle: { fontSize: 32, fontWeight: 'bold' },
  gameArea: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop:20,
  },
  forceIndicator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  forcebar: {
    backgroundColor: '#35383fff',
    height: 100,
    width: 10,
    borderRadius: 20,
    overflow: 'hidden'
  },
  forceLevel: {
    width: '100%',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20
  },
  ropeArea: {
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  rope: {
    width: ROPE_LENGTH,
    height: 10,
    backgroundColor: '#e4e8efff',
    borderRadius: 5,
    zIndex: 1
  },
  centerLine: {
    position: 'absolute',
    width: 2,
    height: 40,
    backgroundColor: 'red',
    zIndex: 0
  },
  winnerText: {
    textAlign: 'center',
    fontSize: 28,
    fontWeight: 'bold',
    marginVertical: 20,
    color: '#facc15'
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  playerButton: {
    borderRadius: 10,
    width: screenWidth * 0.4,
    height: 300,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8
  }
});