一开始考虑的方式是比较古早的react-navigation的版本，所以需要在web端去抹平navigation的处理已经modal的处理
后续的@react-navigation/native 和 @react-navigation/stack已经比较好的的支持了web的同构了
所以直接采用v6的react-navigtation进行处理基本的stack和modal的跳转正常使用navigaion的
`navigate` `push` `pop` `goBack`进行处理就可以了
### Modal路由
只需要在路由文件中配置 ```screenOptions``` 中的 ```presentation``` 为 ```modal```
代码如下

```JavaScript
      <Stack.Group screenOptions={{ presentation: 'modal' }}>
        <Stack.Screen name="Modal" component={ModalScene} />  
      </Stack.Group>
```
### Modal 里面 stack 的路由跳转问题
在正常交互设计中这种情况一般比较少的，如果有需要这里需要看项目情况做设计，主要有两种方案，
1. 还是正常的使用```navitaion.push()```进行Modal跳转，新增新的路由记录，使用Push是相同的页面跳转可能因参数不同显示是不同的，回退还能进行查看处理的。这个前提是需要将所有router都注册Modal和Stack模式，这样根据需要选择screen或screenModal进行调准
2. 使用```navigation.navigate()``` OR ```navigation.setParams()```进行处理，组件是相同的，参数不同的，一般跳转完用户操作结束不会需要回退的场景，这里通过navigate相当于replace掉当前页，替换传参，同理setParams也一样，需要对params更新后做渲染处理，手动避免一些rerender的情况。传参可以增加一个component的参数以及params参数，这样就可以实现Modal内的组件替换，前提是需要统一将路由统一一个Map，通过Map[component]迏到组件替换的目的,事例代码如下
```JavaScript
import routers from './router/routes'
export default class ModalScene extends Component {

  render() {
    const {navigation,route} = this.props;
    const {component,params} = route.params;
    return (
      <View style={styles.container}>
        {routers[memo](params)}
      </View>
    );
  }
}
```
## 以下是古早版本的react-navigation同构的兼容方案

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