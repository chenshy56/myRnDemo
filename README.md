##### (1) navigate 跳转

在 rn 端的跳转方式使用如下:

const { navigation } = this.props;
navigation.navigate('目标页面', params);
在 web 端, 自定义 navigate 方法
```javascript
  const navigate = (toScene, params) => {
    const {navigationOptions} = routeMap[toScene];
    const isRouteModal = navigationOptions.modal;
    let routePath = navigationOptions.path;
    // 将:param? 替换成对应参数
    if (params && Object.keys(params).length > 0) {
      Object.keys(params).forEach((param) => {
        const re = RegExp(`:${param}\\??`);
        routePath = routePath.replace(re, escape(params[param]));
      });
    }
    //从url中删除空参数 : 和 ? 之间的每个字符串都带有实际值
    routePath = routePath.replace(/\/:(.*?)(?=\/|$)/g, '');
    if (!isRouteModal) {
      history.push(routePath);
    } else {
      // 检查网址是否以斜杠结尾
      const slash = /\/$/.test(match.url) ? '' : '/';
      // 浏览器中的当前网址+斜杠+带有参数的模式网址
      routePath = match.url + slash + routePath;
      // 从网址中删除*
      routePath = routePath.replace(/\*\/?/g, '');
      history.push(routePath);
    }
  };
```
(2) getParam 获取参数

在 rn 端的获取参数方式使用如下: 
```javascript
const { navigation } = this.props;
navigation.getParam('xxx');
在 web 端, 自定义 getParam 方法 

// 获取参数
const getParam = (param, alternative) => {
  return match.params[param] || alternative;
};
(3) goBack 返回上一页
```
 在 rn 端的返回上一页方式使用如下: 
```javascript
const { navigation } = this.props;
navigation.goBack();
在 web 端, 自定义 goBack 方法  

// 返回
const goBack = () => {
  history.goBack();
};
```
(4) 回退到路由栈的某个页面

在 react-navigation 中，可以使用 pop 回到导航栈中的前 n 个页面。但是在 react-router 中 并未提供这样的功能，因为在react-router 中并不存在栈的概念。为了解决这个问题，需要引入一个自定义的 pop 函数。 

react-native 端:
```javascript
import {StackActions} from 'react-navigation';

const pop = ({navigation, n}) => {
  navigation.dispatch(StackActions.pop({n}));
};

export default pop;
```
web 端:
```javascript
const pop = ({ screen, navigation }) => {
  navigation.navigate(screen)
}

export default pop
```
使用方式:
```javascript
// screen 用于web端跳转
// n 用于指定 rn 端回退的层级
// navigation 为当前路由
pop({screen: 'FirstScreen', n: 2, navigation})
```
##### 模态框
在 react-native 端实现 Dialog 非常简单, 并且也可以使用react-navigation, 定义modal模式, 即可实现从下向上滑出的模态页面, web 端需要借助 react-router-modal 来实现类似的模态效果
```javascript
const RouteMap = {
  Modal: {
    screen: ModalScene,
    navigationOptions: {
        path: '*/basemodal',
        modal: true //路由会用 ModalRoute 路由组件来渲染
    }
  }
}
```
然后将 <ModalContainer /> 添加到 render 中 即可。