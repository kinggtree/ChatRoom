# 目录

- [开发原则](#开发原则)
- [React部分开发小记](#React部分开发小记)
- [React中类组件和函数式组件的区别](#React中类组件和函数式组件的区别)
- [React组件中，如果需要设置一个暂时为空的object，可以怎么做？](#React组件中，如果需要设置一个暂时为空的object，可以怎么做？)
- [React中一次渲染和二次渲染](#React中一次渲染和二次渲染)
- [React中组件动态获取当前路由地址](#React中组件动态获取当前路由地址)
- [在React类组件中使用this绑定函数](#在React类组件中使用this绑定函数)
- [数组的map方法](#数组的map方法)

请注意，这个目录的链接是根据GitHub的Markdown渲染规则生成的，即每个标题的链接是标题文字的小写版本，并且空格被替换成了短横线（-）。不同的Markdown渲染器可能会有不同的规则，所以在某些环境中，这个目录的链接可能无法正确跳转。如果你在使用目录时遇到任何问题，欢迎随时告诉我。

# <a id="开发原则">开发原则</a>

1. 让组件尽可能只负责渲染UI，而将状态管理交给上层组件或者专门的状态管理库。这样可以提高组件的复用性，简化组件的测试，以及使得组件的行为更容易预测。

# <a id="React部分开发小记">React部分开发小记</a>

1. 对于message, button, input框, 我们只需要使用“用箭头函数所表达的react组件，因为这些基础类的东西只是返回一个React元素，并不需要复杂的逻辑。

2. 而对于部分需要复杂逻辑的地方，例如ChatBox，则应该使用类组件（class和extend）来实现功能。

    因为在React 16.8之前，函数式组件(function)无法支持componentDidMount这种生命周期方法，而在16.8之后则加入了useEffect Hooks来模拟这种方法。（详情见下）

    出于对兼容性的考虑，我们应该首选class组件来实现复杂功能

3. 消息的读取状态可能更适合放在上层的状态管理中，而不是每个Message组件的状态中。这是因为通常你可能需要知道用户读取了哪些消息，以便显示未读消息数量等。对于这种应用，你可能会使用诸如Redux或者MobX这样的状态管理库，或者使用React的context和hooks来实现。

# <a id="React中类组件和函数式组件的区别">React中类组件和函数式组件的区别</a>

类组件和函数式组件是React中两种不同类型的组件，它们在一些方面有所区别：

1. **语法**：类组件使用ES6的类语法来创建，而函数式组件就是普通的JavaScript函数。

   类组件示例：
   ```jsx
   class MyClassComponent extends React.Component {
       render() {
           return <div>Hello, World!</div>;
       }
   }
   ```

   函数式组件示例：
   ```jsx
   function MyFunctionComponent() {
       return <div>Hello, World!</div>;
   }
   ```

2. **生命周期方法**：在React 16.8版本之前，只有类组件可以使用诸如`componentDidMount`、`componentDidUpdate`等生命周期方法。函数式组件在React 16.8以前并不具备这种能力。但是，随着React Hooks的引入，现在你可以在函数式组件中通过使用`useEffect` Hook来模拟这些生命周期方法。

3. **状态**：在React 16.8版本之前，只有类组件可以有内部状态，通过`this.state`和`this.setState`进行访问和更新。但是，React 16.8引入的`useState` Hook允许我们在函数式组件中使用状态。

例如，在类组件中，我们这么设置并更新state:

```jsx
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      objectName: [],
    };
  }

  componentDidMount(){
    this.setState({
        objectName: ...,
    })
  }

  render(){
    return(......)
  };
}
```

而在函数组件中，我们这么设置并更新state:

```jsx
function MyComponent(){
    const [objectName, setObjectName]=useState([]);

    const handleXXX=event=>{
        event.preventDefalut();     //阻止默认事件发生
        setObjectName(event.otherObject);
    }

    return(......);
}
```

注意：在函数组件中，React Hooks（包括useState）必须遵循两个重要规则：

    1. 只在最顶层使用Hook。不要在循环，条件或嵌套函数中调用Hook。
    2. 只在React函数中调用Hook。不要在普通的JavaScript函数中调用Hook。

4. **this关键字**：在类组件中，`this`关键字用于访问组件的属性和方法，例如`this.props`和`this.state`。在函数式组件中，由于它们只是JavaScript函数，不存在`this`的概念。

5. **简洁性**：一般来说，函数式组件的语法更简洁，更易于阅读和理解。而类组件可能由于使用`this`关键字、需要绑定事件处理器等原因，代码会稍显复杂。

总的来说，随着React Hooks的引入，函数式组件的能力已经和类组件基本上齐平了。尽管在某些特定场景下（如错误边界处理），类组件仍然有其必要性，但大多数情况下，你可以根据喜好和需求选择使用类组件还是函数式组件。

# <a id="React组件中，如果需要设置一个暂时为空的object，可以怎么做？">React组件中，如果需要设置一个暂时为空的object，可以怎么做？</a>

可以设置state中一个变量为 **空数组** ：

```jsx
class MyComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            objectName: [],
        };
    }
```

## 为什么不能设置成null?

在JavaScript中，当你试图在`null`上执行数组方法，例如`map`，会抛出一个错误，因为`null`不是一个对象，不能执行这些方法。如果`this.state.users`初始化为`null`，那么在数据加载完成之前，`this.state.users.map`将会导致程序崩溃。

另一方面，初始化`this.state.users`为一个空数组`[]`意味着它始终是一个数组，所以你可以安全地调用`map`，无论是否已经加载了用户数据。如果用户数据还未加载，`map`只是在一个空数组上执行，返回另一个空数组，而不会产生任何效果。当数据加载后，`map`就会根据加载的数据产生列表元素。

这就是为什么在处理可能的异步数据时，最好将初始状态设为一个空的数据结构（例如空数组），而不是`null`或`undefined`。这种做法能避免程序在数据还未加载时因试图访问`null`或`undefined`而崩溃。

如果你希望使用`null`表示数据还未加载，那么你就需要在渲染之前检查数据是否已经加载。例如：

```jsx
render() {
    if (this.state.users === null) {
        return <div>Loading...</div>;  // 显示一个加载提示，或者渲染一个空的组件
    } else {
        return (
        <div>
            <Typography variant="body1">
            There are users below:
            </Typography>
            <List component="nav">
            {this.state.users.map(item => (
                <UserListItem key={item._id} data={item} />
            ))}
            </List>
        </div>
        );
    }
}
```

# <a id="React中一次渲染和二次渲染">React中一次渲染和二次渲染</a>

在React中，一次渲染和二次渲染是指React组件在某一段时间内的渲染次数。 

- **一次渲染**：这通常指的是组件的初始渲染或者由于父组件的重新渲染引起的子组件的渲染。在一次渲染中，React会创建和插入DOM节点，执行组件的生命周期方法（如`componentDidMount`），并设置初始状态和属性。

- **二次渲染**：如果在组件的生命周期或事件处理程序中调用`this.setState()`（或使用Hook的`setState`），则React会将这视为一个状态更改，并触发组件的二次渲染。在二次渲染中，React会使用新的状态和属性计算新的虚拟DOM，然后与旧的虚拟DOM进行对比（这个过程叫做diffing），并且只更新实际DOM中改变的部分。这就是React的核心优化策略之一，叫做“Reconciliation”。

举个例子，假设你有一个组件，它在`componentDidMount`中发起一个网络请求来获取数据，然后将数据存储在组件的状态中。那么：

- 在**一次渲染**中，组件将被插入到DOM中，但此时数据可能还没有被加载完成，所以可能展示一些加载中的状态或者占位符。

- 当数据被加载完成并调用`this.setState()`后，会触发一个**二次渲染**。在这个渲染中，React会使用加载完成的数据来更新DOM，展示真正的内容。

这种模式可以确保组件在加载数据时仍然响应，并且可以给用户显示一些反馈，例如加载动画，而不是让用户等待整个数据加载完成后再进行渲染。

# <a id="React中组件动态获取当前路由地址">React中组件动态获取当前路由地址</a>

在React Router中，冒号（:）前缀用于定义动态的路由参数。这个参数可以在请求的URL中被改变，并且这个值可以在对应的组件中通过`this.props.match.params`（对于类组件）或`useParams()`（对于函数组件）来获取。

例如，考虑以下路由：

```jsx
<Route path="/users/:id" component={UserComponent} />
```

在这个例子中，`:id`定义了一个动态的路由参数。当你访问如`/users/123`或`/users/456`等等的URL时，`UserComponent`都会被渲染，而且你可以在`UserComponent`中获取`id`参数的值。

以下是在函数组件中获取参数的例子：

```jsx
import { useParams } from 'react-router-dom';

function UserComponent() {
    let { id } = useParams();
    // 这里的 id 将会是你在 URL 中指定的值，例如 '123' 或 '456'

    // 你可以用这个 id 来从服务器获取数据，或做其他处理
    // ...

    return <div>{/* ... */}</div>;
}
```

类组件中获取参数：

```jsx
class MyComponent extends React.Component {
    constructor(props) {
        super(props);
        this.id=this.props.match.params.userId;
    };

    render(){
        return(......);
    };
}
```

这个特性使得你可以创建复杂的路由，并且根据URL中的参数来改变你的组件的行为。这对于如用户页面、产品页面等需要参数来确定内容的页面非常有用。

# <a id="在React类组件中使用this绑定函数">在React类组件中使用this绑定函数</a>

在类组件中，我们为了让组件内函数能够被其他函数（或者render）调用，我们需要一些方法来绑定。

这是因为事件处理函数在被调用时，`this` 不会自动绑定到组件实例。因此，你需要手动绑定 `this`。在类组件中，有两种常见的方式来绑定 `this`：

以下是常用的两种绑定方法：

1. **在构造函数中绑定**：

```jsx
class SomeComponent extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        // ...
    }

    render() {
        return <button onClick={this.handleClick}>Go to user 123</button>;
    }
}
```

在这个例子中，我们在构造函数中使用 `.bind(this)` 来确保 `handleClick` 方法中的 `this` 指向组件实例。

2. **使用类属性和箭头函数**：

```jsx
class SomeComponent extends React.Component {
    handleClick = () => {
        // ...
    }   // 因为这里创建了自己的一个包含this的对象

    render() {
        return <button onClick={this.handleClick}>Go to user 123</button>;
    }
}
```

在这个例子中，我们使用了箭头函数来定义 `handleClick` 方法。箭头函数会自动绑定 `this` 到定义它的上下文中，即组件实例。

需要注意的是，第二种方法需要 Babel 插件（如 `@babel/plugin-proposal-class-properties`）的支持，而且这种语法还没有被正式包含在 JavaScript 规范中（截止我知识库最后更新的时间 2021年9月）。在没有配置这些插件的项目中，你可能需要使用第一种方法来绑定 `this`。

# <a id="数组的map方法">数组的map方法</a>

在JavaScript中，数组的 `map` 方法是一个非常常用的函数，用于处理数组中的每一个元素，并创建一个新的数组返回。

`map` 方法接收一个函数作为参数，这个函数会被应用到数组的每一个元素上，生成一个新的元素，并组成新的数组。原数组不会被改变。

这个函数接收三个参数：

1. `currentValue`：当前被处理的元素。
2. `index`（可选）：当前被处理的元素的索引。
3. `array`（可选）：调用 `map` 方法的数组。

以下是一个示例：

```js
const array = [1, 2, 3, 4, 5];

const newArray = array.map((value, index) => {
  return value * 2;  // 乘以2
});

console.log(newArray);  // 输出: [2, 4, 6, 8, 10]
```

在这个示例中，`map` 方法对 `array` 中的每一个元素执行了一个函数，这个函数接收一个参数（当前元素的值），并返回这个值乘以2。`map` 方法将所有返回的结果组合成一个新的数组。

值得注意的是，`map` 方法总是返回一个新的数组，原来的数组不会被改变。如果你不需要一个新的数组，而是想对原数组进行操作，你可能需要使用其他的数组方法，如 `forEach`。