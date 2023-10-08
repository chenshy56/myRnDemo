import React, {Component} from 'react';
import {View, Text, StyleSheet, Button} from 'react-native';

export default class ModalScene extends Component {
  goBack = () => {
    const {navigation} = this.props;
    navigation.goBack();
  };
  navigateTo = (route,params) => {
    const {navigation} = this.props;
    navigation.navigate(route, params);
  }
  push = (route,params) => {
    const {navigation} = this.props;
    navigation.push(route, params);
  }
  render() {
    const {navigation,route} = this.props;
    const {memo} = route.params;
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Modal, {memo}
        </Text>
        <Text onPress={this.navigateTo.bind(this,'Happy',{name: 'Coding!'})}>
          goHappy
        </Text>
        <Text onPress={this.push.bind(this,'Modal',{name: 'Coding', memo: 'Happy'})}>
          goModal
        </Text>
        <Text style={styles.welcome} onPress={this.goBack}>
          返回上一页
        </Text>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
});
