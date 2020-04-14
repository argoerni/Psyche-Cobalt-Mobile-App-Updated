import React from 'react';
import { View, StatusBar, ImageBackground, Text } from 'react-native';
import { GameEngine } from 'react-native-game-engine';
import { Fonts } from '../components/Fonts';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from './utilities';
import Matter from 'matter-js';

// Components
import LoadingModal from './components/LoadingModal';
import NavigationModal from './components/NavigationModal';
import GameOverModal from './components/GameOverModal';
import BottomBar from './components/BottomBar';
import TopBar from './components/TopBar';

// Game Engine
import { ENGINE, WORLD } from './engine/physicsInit';
import { GAME_DEFAULTS, POWERUP_ENUM, defaultEntities } from './engine/init';

// GAME ENGINE :: SYSTEMS
import { SYSTEMS } from './engine/systems';
import { Reset } from './engine/systems/reset';

export default class GameView extends React.Component {
  state = {
    imageLoaded: false,
    navigationModalVisible: false,
    gameOverModalVisible: false,
    running: true,
    systems: SYSTEMS,
    powerUps: GAME_DEFAULTS.powerUps,
    statusHealth: GAME_DEFAULTS.player.health,
    statusScore: GAME_DEFAULTS.player.score,
    statusLevel: GAME_DEFAULTS.player.level,
  };

  _isMounted = false;
  _gameEngineRef = null;

  // NOTE :: LIFECYCLE HOOKS

  componentDidMount() {
    this._isMounted = true;
    this.resetGame();
    this.runCollisionHandler();
  }

  componentWillUnmount() {
    this.stopGame();
    this._isMounted = false;
  }

  // NOTE :: MODAL HANDLERS

  setNavigationModalVisible = (visible) => {
    this.setState({ navigationModalVisible: visible });
  };

  setGameOverModalVisible = (visible) => {
    this.setState({ gameOverModalVisible: visible });
  };

  // NOTE :: GAME INITIALIZATION, STOP, AND RESET

  setEngineRef = (ref) => {
    this._gameEngineRef = ref;
  };

  stopGame = () => {
    if (this._isMounted && this._gameEngineRef) {
      console.log('STOP GAME');
      this.setState({ running: false, systems: [] });
    }
  };

  resetGame = () => {
    if (this._isMounted && this._gameEngineRef) {
      console.log('RESET GAME');
      Matter.World.clear(WORLD);
      Matter.Engine.clear(ENGINE);
      this._gameEngineRef.swap(defaultEntities());
      this.setState(
        {
          running: true,
        },
        () => {
          this.setState({
            systems: [...SYSTEMS],
            powerUps: [...GAME_DEFAULTS.powerUps],
            statusHealth: GAME_DEFAULTS.player.health,
            statusScore: GAME_DEFAULTS.player.score,
            statusLevel: GAME_DEFAULTS.player.level,
          });
        }
      );
    }
  };

  // NOTE :: GAME HANDLERS

  runCollisionHandler = () => {
    Matter.Events.on(ENGINE, 'collisionStart', (e) => {
      if (
        this._isMounted &&
        this._gameEngineRef &&
        (!e.pairs[0].bodyA.isStatic || !e.pairs[0].bodyB.isStatic)
      ) {
        let id = null;
        if (!e.pairs[0].bodyA.isStatic) {
          id = e.pairs[0].bodyA.id;
        } else if (!e.pairs[0].bodyB.isStatic) {
          id = e.pairs[0].bodyB.id;
        }
        this._gameEngineRef.dispatch({
          type: 'asteroidCollision',
          id: id,
        });
      }
    });
  };

  // TODO :: EXTRACT FROM CLASS (HOOK, WAIT BC LARGE REFACTOR)

  onEvent = (e) => {
    if (e.type === 'setStatusHealth') {
      const newHealth = e.value;
      this.setState({ statusHealth: newHealth });
    } else if (e.type === 'setStatusScore') {
      const newScore = e.value;
      this.setState({ statusScore: newScore });
    } else if (e.type === 'setStatusLevel') {
      const newLevel = e.value;
      this.setState({ statusLevel: newLevel });
    } else if (e.type === 'addPowerUpToBar') {
      for (const powerUpIndex in this.state.powerUps) {
        if (this.state.powerUps[powerUpIndex] === POWERUP_ENUM.empty) {
          let powerUps = this.state.powerUps;
          powerUps.splice(powerUpIndex, 1, e.value);
          this.setState({ powerUps: powerUps });
          return;
        }
      }
    } else if (e.type === 'activatePowerUp') {
      let powerUps = this.state.powerUps;
      powerUps.splice(e.index, 1, POWERUP_ENUM.empty);
      this.setState({ powerUps: powerUps }, () => {
        switch (e.value) {
          case POWERUP_ENUM.clearScreen:
            this._gameEngineRef.dispatch({
              type: 'effectClearScreens',
            });
            break;
          case POWERUP_ENUM.clock:
            this._gameEngineRef.dispatch({
              type: 'effectClock',
            });
            break;
          case POWERUP_ENUM.health:
            this._gameEngineRef.dispatch({
              type: 'setHealth',
              value: 10,
            });
            break;
          default:
            break;
        }
      });
    } else if (e.type === 'gameOver') {
      this.setState({ systems: [Reset] }, () => {
        this._gameEngineRef.dispatch({ type: 'beginCleanup' });
      });
    } else if (e.type === 'endCleanup') {
      console.log('RESET ENTITIES COMPLETE');
      this.stopGame();
      this.setGameOverModalVisible(true);
    }
  };

  handleActivatePowerUp = (index, value) => {
    this._gameEngineRef.dispatch({
      type: 'activatePowerUp',
      index: index,
      value: value,
    });
  };

  render() {
    return (
      <View style={styles.outerContainer}>
        <ImageBackground
          source={require('../assets/images/backgrounds/starsbg.jpg')}
          style={styles.image}
          onLoadEnd={() => this.setState({ imageLoaded: true })}
        >
          {!this.state.imageLoaded && (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading...</Text>
            </View>
          )}
          {this.state.imageLoaded && (
            <GameEngine
              ref={this.setEngineRef}
              running={this.state.running}
              style={styles.innerContainer}
              systems={this.state.systems}
              entities={defaultEntities()}
              onEvent={this.onEvent}
            >
              <StatusBar hidden={true} />
              <NavigationModal
                modalVisible={this.state.navigationModalVisible}
                setModalVisible={this.setNavigationModalVisible}
                handleGameView={this.props.handleGameView}
              />
              <GameOverModal
                modalVisible={this.state.gameOverModalVisible}
                setModalVisible={this.setGameOverModalVisible}
                handleGameView={this.props.handleGameView}
                score={this.state.statusScore}
                handleGameReset={this.resetGame}
              />
              <TopBar
                setNavigationModalVisible={this.setNavigationModalVisible}
                score={this.state.statusScore}
                level={this.state.statusLevel}
              />
              <BottomBar
                health={this.state.statusHealth}
                powerUps={this.state.powerUps}
                handleActivatePowerUp={this.handleActivatePowerUp}
              />
            </GameEngine>
          )}
        </ImageBackground>
        {/* <LoadingModal imageLoaded={true} /> */}
      </View>
    );
  }
}

const styles = {
  outerContainer: {
    flex: 1,
    // backgroundColor: '#1e2223'
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  loadingContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#1e2223',
  },
  loadingText: {
    fontSize: SCREEN_HEIGHT * (1 / 16),
    // letterSpacing: 2,
    fontFamily: Fonts.BungeeRegular,
    textAlign: 'center',
    color: '#bca0dc',
  },
  innerContainer: {
    flex: 1,
  },
};
