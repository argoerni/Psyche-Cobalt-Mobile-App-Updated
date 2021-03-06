import React from 'react';
import { View } from 'react-native';
import Matter from 'matter-js';

import { SCREEN_WIDTH, SCREEN_HEIGHT } from '../../utilities';
import { WORLD } from '../../engine/physicsInit';

const PsycheRover_Matter = Matter.Bodies.rectangle(
  SCREEN_WIDTH / 2,
  SCREEN_HEIGHT * 0.75,
  Math.trunc(SCREEN_WIDTH * 0.15),
  Math.trunc(SCREEN_HEIGHT * 0.075),
  {
    isStatic: true,
    collisionFilter: {
      category: 0x0001,
      mask: 0x0002
    }
  }
);

class PsycheRover extends React.Component {
  componentDidMount() {
    Matter.World.add(WORLD, [this.props.body]);
    // console.log('PSYCHE NEW BODY: ', this.props.body.id);
    // console.log('PSYCHE BOUNDS: ', this.props.body.bounds);
    // console.log(this.props.body);
  }

  componentWillUnmount() {
    Matter.World.remove(WORLD, [this.props.body]);
  }

  render() {
    const width = Math.trunc(SCREEN_WIDTH * 0.15);
    const height = Math.trunc(SCREEN_HEIGHT * 0.075);
    const x = this.props.body.position.x - width / 2;
    const y = this.props.body.position.y - height / 2;

    return (
      <View
        style={[
          styles.psycheRover,
          {
            left: x,
            top: y,
            width: width,
            height: height
          }
        ]}
      ></View>
    );
  }
}

const styles = {
  psycheRover: {
    position: 'absolute',
    backgroundColor: '#bca0dc'
  }
};

export { PsycheRover, PsycheRover_Matter };
