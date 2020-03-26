import React from 'react';
import { View, Text } from 'react-native';
import Matter from 'matter-js';
import Emoji from 'react-native-emoji';

import { SCREEN_WIDTH, SCREEN_HEIGHT } from '../../utilities';
import { WORLD } from '../../engine/physicsInit';

const radius = Math.trunc(Math.max(SCREEN_WIDTH, SCREEN_HEIGHT) * 0.125) / 2;

const Create_Asteroid_Matter = (posX, posY) => {
  return Matter.Bodies.circle(posX, posY, radius, {
    collisionFilter: {
      category: 0x0002,
      mask: 0x0001
    }
  });
};

class Asteroid extends React.Component {
  componentDidMount() {
    Matter.World.add(WORLD, [this.props.body]);
    // console.log('PSYCHE BOUNDS: ', this.props.body.bounds);
    // console.log('ADD ASTEROID');
    // console.log('BODY: ', this.props.body);
    // console.log('BODY POSITION Y: ', this.props.body.position.y);
    // console.log('BODY MIN Y: ', this.props.body.bounds.min.y);
    // console.log('BODY MAX Y: ', this.props.body.bounds.max.y);
    // console.log('SCREEN_HEIGHT: ', SCREEN_HEIGHT);
    // console.log('\n');
  }

  componentWillUnmount() {
    Matter.World.remove(WORLD, [this.props.body]);
    // console.log('Remove Body');
  }

  componentWillUnmount() {
    Matter.World.remove(WORLD, [this.props.body]);
  }

  render() {
    const width = Math.trunc(Math.max(SCREEN_WIDTH, SCREEN_HEIGHT) * 0.125);
    const height = Math.trunc(Math.max(SCREEN_WIDTH, SCREEN_HEIGHT) * 0.125);
    const x = this.props.body.position.x - width / 2;
    const y = this.props.body.position.y - height / 2;

    return (
      <View
        style={[
          styles.asteroid,
          {
            left: x,
            top: y,
            width: width,
            height: height,
            borderRadius: width / 2
          }
        ]}
      >
        <Emoji name="comet" style={{ fontSize: radius }} />
      </View>
    );
  }
}

const styles = {
  asteroid: {
    position: 'absolute',
    backgroundColor: '#bfbfbf',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }
};

export { Asteroid, Create_Asteroid_Matter };
