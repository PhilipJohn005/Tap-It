import { Text, View,StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { StatusBar } from 'expo-status-bar';
import { useState } from "react";



const {width:screenWidth,height:screenHeight}=Dimensions.get('window')
const ROPE_LENGTH=screenWidth*0.8

export default function Index() {
  const [player1Force,setPlayer1Force]=useState<number>(0);
  const [player2Force,setPlayer2Force]=useState<number>(0);

  const handlePlayer1Click=()=>{

  }

  const handlePlayer2Click=()=>{

  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark"/>

      <View style={styles.header}>  
        <View style={styles.scoreContainer}>
          <Text style={[styles.playerName,{color: '#3B82F6'}]}>Player 1</Text>
          <Text style={[styles.scoreStyle,{color:'#3B82F6'}]}>20</Text>
        </View>

        <TouchableOpacity style={styles.resetButton}>
            <Text style={[{color:'#ecedeeff'}]}>Reset</Text>
        </TouchableOpacity>

        <View style={styles.scoreContainer}>
          <Text style={[styles.playerName,{color:'#EF4444'}]}>Player 2</Text>
          <Text style={[styles.scoreStyle,{color:'#EF4444'}]}>30</Text>
        </View>

      </View>

      <View style={styles.gameArea}>

        <View style={styles.forceIndicator}>
          <View style={styles.forcebar}>
            <View
              style={[styles.forceLevel,{
                backgroundColor:'#3B82F6',
                height: `${Math.min(100, (player1Force / 20) * 100)}%`,
              }]}
            />
          </View>

          <View style={styles.forcebar}>
            <View
              style={[styles.forceLevel,{
                backgroundColor:'#EF4444',
                height: `${Math.min(100, (player2Force / 20) * 100)}%`,
              }]}
            />
          </View>
        </View>

        <View> {/* Rope */}
          

        </View>



        <View style={styles.controlsContainer}>
          <TouchableOpacity style={[styles.playerButton,{backgroundColor:'#3B82F6'}]} activeOpacity={0.7} onPress={handlePlayer1Click}>
              <Text>TAP!</Text>
              <Text>Player 1</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.playerButton,{backgroundColor:'#EF4444'}]} activeOpacity={0.7} onPress={handlePlayer2Click}>
              <Text>TAP!</Text>
              <Text>Player 2</Text>
          </TouchableOpacity>
        </View>

      </View>

    </View>
  );
}

const styles=StyleSheet.create({
  container:{
    flex:1,
    backgroundColor: '#0F172A',
  },
  header:{
    flexDirection:'row',
    backgroundColor:'#4b65a2ff',
    justifyContent:'space-between',
    alignItems:'center',
    paddingHorizontal:20,
    paddingTop:60
  },
  scoreContainer:{
    alignItems:'center'
  },
  resetButton:{
    backgroundColor: '#374151',
    paddingHorizontal:20,
    paddingVertical:10,
    borderRadius:20,
  },
  playerName:{
    fontSize:18,
    fontWeight:'600',
    marginBottom:5
  },
  scoreStyle:{
    fontSize:32,
    fontWeight:'bold'
  },
  gameArea:{
    backgroundColor:'#39d6ebff'
  },
  forceIndicator:{
    paddingTop:10,
    paddingHorizontal:20,
    flexDirection:'row',
    justifyContent:'space-between',
  },
  forcebar:{
    backgroundColor:'#35383fff',
    height:100,
    width:10,
    borderRadius:20
  },
  forceLevel:{

  },
  controlsContainer:{
    flexDirection:'row',
    justifyContent:'space-between',
    paddingHorizontal:20
  },
  playerButton:{
    borderRadius:10,
    width: screenWidth*0.4,
    height: 120,
    flexDirection:'column',
    justifyContent:'center',
    alignItems:'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
})
