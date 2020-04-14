import React from 'react';
import { View, Text, TouchableHighlight, Modal } from 'react-native';

import { Fonts } from '../../components/Fonts';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from '../utilities';
import { GAMEVIEW_ENUM } from '../types';

export default class NavigationModal extends React.Component {
  render() {
    return (
      <Modal
        supportedOrientations={['portrait', 'landscape-left']}
        animationType="fade"
        transparent={true}
        visible={this.props.modalVisible}
        onRequestClose={() => {}}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.titleText}>menu</Text>
          <View style={styles.buttonContainer}>
            <TouchableHighlight
              onPress={() => {
                // TODO: Add callback to handle async state change (?)
                this.props.setModalVisible(!this.props.modalVisible);
                this.props.handleGameView(GAMEVIEW_ENUM.start);
              }}
              style={styles.exitButton}
            >
              <Text style={styles.exitButtonText}>exit game</Text>
            </TouchableHighlight>
            <TouchableHighlight
              onPress={() => {
                // TODO: Add callback to handle async state change (?)
                this.props.setModalVisible(!this.props.modalVisible);
                this.props.handleGameView(GAMEVIEW_ENUM.tutorial);
              }}
              style={styles.tutorialButton}
            >
              <Text style={styles.tutorialButtonText}>view tutorial</Text>
            </TouchableHighlight>
            <TouchableHighlight
              onPress={() => {
                this.props.setModalVisible(!this.props.modalVisible);
              }}
              style={styles.cancelButton}
            >
              <Text style={styles.cancelButtonText}>cancel</Text>
            </TouchableHighlight>
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = {
  modalContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(30,34,35,0.75)',
  },
  titleText: {
    marginVertical: SCREEN_HEIGHT * (1 / 32),
    color: '#bca0dc',
    fontSize: SCREEN_HEIGHT * (1 / 8),
    fontFamily: Fonts.BungeeRegular,
  },
  buttonContainer: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    // backgroundColor: 'purple'
  },
  exitButton: {
    height: SCREEN_HEIGHT * (1 / 8),
    width: SCREEN_WIDTH * (3 / 5),
    borderWidth: 1,
    borderColor: '#bca0dc',
    marginVertical: SCREEN_HEIGHT * (1 / 32),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#bca0dc',
  },
  exitButtonText: {
    color: '#1e2223',
    fontSize: SCREEN_HEIGHT * (1 / 16),
    fontFamily: Fonts.BungeeRegular,
  },
  tutorialButton: {
    height: SCREEN_HEIGHT * (1 / 8),
    width: SCREEN_WIDTH * (2 / 5),
    borderWidth: 1,
    borderColor: '#bca0dc',
    marginVertical: SCREEN_HEIGHT * (1 / 32),
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'pink'
  },
  tutorialButtonText: {
    color: '#bca0dc',
    fontSize: SCREEN_HEIGHT * (1 / 16),
    fontFamily: Fonts.BungeeRegular,
  },
  cancelButton: {
    height: SCREEN_HEIGHT * (1 / 8),
    width: SCREEN_WIDTH * (1 / 5),
    marginVertical: SCREEN_HEIGHT * (1 / 32),
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'green'
  },
  cancelButtonText: {
    color: 'white',
    fontSize: SCREEN_HEIGHT * (1 / 16),
    fontFamily: Fonts.BungeeRegular,
  },
};
