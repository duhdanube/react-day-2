const Title = React.createClass({
  render: function() {
    return (
      <div>
      <h1>Welcome to React</h1>
      </div>
    );
  }
})

const Counter = React.createClass({
  // can do inline setState like button onClick = {() => {this.setState({counter: this.state.counter + 1})}}
  render: function() {
    let {counter, addCount, minusCount} = this.props; // uses spread operator
    //let {counter, addCount, minusCount} = this.props.allProps; //allProps is object from Root component below, uses destructuring object

    return ( //parenthesis are here so we can split the JSX into multiple lines
      <div>
        <h3>Counter: {counter}</h3>
        <button onClick={addCount}>+</button>
        <button onClick={minusCount}>-</button>
      </div>
    )
  }
})

const NewMessageForm = React.createClass({
  getInitialState: function() {
    return {
      text: ""
    }
  },
  addMessage: function() {
    this.props.addMessage(this.state.text);
    this.setState({text: ""});
  },
  onInputChange: function(event) { //this is like an event handler
    this.setState({text: event.target.value})
  },
  render: function() {
    return(
      <div>
        <input type="text" value={this.state.text} onChange={this.onInputChange}/>
        {/*<input type="text" value={this.state.text} onChange={e => {this.setState({text: e.target.value})}}/>*/}
        {/*The above two lines are the same*/}
        <button onClick={this.addMessage}>Add</button>
      </div>
    )
  }
});

const EditForm = React.createClass({
  getInitialState: function() {
    return {
      text: ""
    }
  },
  onInputChange: function(event) {
    this.setState({text: event.target.value})
  },
  confirmChange: function() {
    this.props.editUpdate(this.props.editId, this.state.text);
    this.props.formVisible();
  },
  render: function() {
    return (
      <div hidden={this.props.hidden}>
        <input type="text" value={this.state.text} onChange={this.onInputChange}/>
        <button onClick={this.confirmChange}>Confirm</button>
      </div>
    )
  }
})

const MessageLi = React.createClass({
  getInitialState: function() {
    return {
      visible: "hidden"
    }
  },
  deleteMessage: function() {
    this.props.deleteMsg(this.props.msgId);
  },
  setFormHidden: function() {
    this.setState({visible: "hidden"});
  },
  updateButtonClick: function() {
    this.setState({visible: ""});
  },
  render: function() {
    return (
      <li>
      {this.props.value}
      <EditForm hidden={this.state.visible} editId={this.props.msgId} formVisible={this.setFormHidden} editUpdate={this.props.updateMsg}/>
      <button className="btn btn-primary" onClick={this.updateButtonClick}>Update</button>
      <button className="btn btn-default" onClick={this.deleteMessage}>Delete</button>
      </li>
    )
  }
})

const MessageList = React.createClass({
  render: function() {
    let messages = this.props.liMessages.map(message => {
      return (
        <MessageLi key={message.id} value={message.text} deleteMsg={this.props.delete} updateMsg={this.props.update} msgId={message.id}/>
      )
    });
    return (
      <ul>
        {messages}
      </ul>
    )
  }
})

const MessageBoard = React.createClass({
  /*getInitialState() {
    New ES6 way of declaring function
  }*/
  getInitialState: function() {
    try {
      var messages = JSON.parse(localStorage.messages); //Use JSON to read messages stored locally
    } catch(err) { //gets initial state as whatever is in local storage
      var messages = [];
    }

    return {messages};
    /*
    return (
    messages: [];
  )
    */
  },
  componentDidUpdate() {
    // STATE/PROPS WERE MODIFIED
    localStorage.messages = JSON.stringify(this.state.messages);
  },
  addMessage: function(text) { //takes message text as argument
    //need to create message object
    let message = {
      text,
      id: uuid()
    };
    this.setState({
      messages: this.state.messages.concat(message)
    });
  },
  deleteMessage: function(msgId) {
    let newArr = this.state.messages.filter(message => {
      return message.id !== msgId;
    });
    this.setState({messages: newArr});
  },
  updateMessage: function(msgId, msgText) {
    let updMessages = this.state.messages;
    let updMessage = {
      text: msgText,
      id: msgId
    };
    for (let i = 0; i < updMessages.length; i++) {
      if (updMessages[i].id === msgId) {
        updMessages[i] = updMessage;
      }
    }
    this.setState({messages: updMessages});
  },
  render: function() {
    return (
      <div>
        <h1>MessageBoard</h1>
        <NewMessageForm addMessage={this.addMessage} />
        <MessageList liMessages={this.state.messages} delete={this.deleteMessage} update={this.updateMessage}/>
      </div>
    )
  }
})

// props is way to give a child component a way to interact with parent's state (in this case Root)
const Root = React.createClass({ //createClass creates a new component
  getInitialState: function() { //get initial states of states
    return { // object with state in it
      counter: 0
    }
  },
  addCount: function() {
    this.setState({counter: this.state.counter + 1}) //This is now talking about the root
  },
  minusCount: function() {
    this.setState({counter: this.state.counter - 1})
  },
  render: function() {
    let propObj = {
      addCount: this.addCount,
      minusCount: this.minusCount,
      counter: this.state.counter
    }

    return ( // Title below is Title class from above
      <div>
        <Title />
        <Counter {... propObj} />
        {/*<Counter addCount={this.addCount} minusCount={this.minusCount} counter={this.state.counter} />*/}
        <hr/>
        <MessageBoard />
      </div>
    )
  }
});
//<Counter allProps = {this.propObj} /> // To use destructuring
ReactDOM.render(
  <Root />, //what to render
  document.getElementById('root') //where to render
);
