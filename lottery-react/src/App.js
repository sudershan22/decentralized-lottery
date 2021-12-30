import logo from "./logo.svg";
import "./App.css";
import React from "react";
import web3 from "./web3";
import lottery from "./lottery";

class App extends React.Component {
  state = {
    manager: "",
    players: [],
    balance: "",
    value: "",
    message:''
  };

  async componentDidMount() {
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);

    this.setState({ manager: manager, players: players, balance: balance });
  }
  onSubmit = async (event) => {
      event.preventDefault();
      
      const accounts = await web3.eth.getAccounts();

      this.setState({message:'Waiting on transaction success...'});

      await lottery.methods.enter().send({
        from: accounts[0],
        value: web3.utils.toWei(this.state.value,'ether')
      });

      this.setState({message:'You have entered the lottery'});

  };
  onClick = async () =>{
          
    const accounts = await web3.eth.getAccounts();

    this.setState({message:'Hold on.. Winner is getting picked..!!!'});

    await lottery.methods.pickWinner().send({
      from: accounts[0]
    });

    this.setState({message:'THE WINNER HAS BEEN PICKED :) Check Contract Transactions'});
  }

  render() {
    return (
      <div>
        <h2>Lottery Contract</h2>
        <p>
          This Lottery is managed by {this.state.manager}. <br></br>
          There are currently {this.state.players.length} people competing to
          win {web3.utils.fromWei(this.state.balance, "ether")} ether!
        </p>
        <hr />
        <form onSubmit={this.onSubmit}>
          <h4>Lottery form</h4>
          <div>
            <label>Amout of ether to enter </label>
            <input
              value={this.state.value}
              onChange={(event) => this.setState({ value: event.target.value })}
            />
          </div>
          <button>Enter</button>
        </form>
        <hr/>
        <h4>Pick a Winner!</h4>
        <button onClick={this.onClick}>Go!</button>
        <hr/>
        <h1>{this.state.message}</h1>
      </div>
    );
  }
}
export default App;
