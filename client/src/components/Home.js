import React, { Component } from 'react';
import {
  Header,
  Container,
  Divider,
  Button
} from 'semantic-ui-react';
import axios from 'axios';
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import Celebrity from './Celebrity'
import Dumpster from './Dumpster'



class Home extends Component {
  state = {
    celebrities: [],
    toMarry: {},
    toFuck: {},
    toKill: {},
  }

  componentDidMount() {
    this.fetchCelebrities()
  }

  handleSubmit = () => {
    const { toMarry, toFuck, toKill } = this.state

    let results = {
      marry_id: toMarry.id,
      fuck_id: toFuck.id,
      kill_id: toKill.id
    }
    axios.post('/api/results', results)
    .then(res => {
      console.log(res)
      this.setState({ toMarry: {}, toFuck: {}, toKill: {} })
      this.fetchCelebrities()
    })
    .catch(err => {console.log(err)})
  }

  fetchCelebrities = () => {
    axios.get('/api/celebrities')
    .then(res => {
      this.setState({celebrities: res.data})
    })
  }

  handleDrop = (itemType, props, monitor) => {
    console.log(props.type, monitor.internalMonitor.registry.pinnedSource.props.celebrity.name)
    this.setState({[props.type]: monitor.internalMonitor.registry.pinnedSource.props.celebrity})
  }

  render() {
    return (
      <div>
        <Header as='h1' textAlign='center'>Marry, Fuck, Kill</Header>
      <div style={styles.homeContainer}>
        <div>
            {this.state.celebrities.map( celebrity => {
              return(
                <Celebrity key={celebrity.id} celebrity={celebrity} />
              )
            })}
        </div>
        {/* <Divider clearing /> */}
        <div>
          <Dumpster
            type='toMarry'
            onDrop={this.handleDrop}
            celebrity={this.state.toMarry}
            title='Marry'
          />
          <Dumpster
            type='toFuck'
            onDrop={this.handleDrop}
            celebrity={this.state.toFuck}
            title='Fuck'
          />
          <Dumpster
            type='toKill'
            onDrop={this.handleDrop}
            celebrity={this.state.toKill}
            title='Kill'
          />
          <Button onClick={() => this.handleSubmit()}>Submit</Button>
        </div>
      </div>
    </div>
    );
  }
}

const styles = {
  homeContainer: {
    display: 'flex',
    flexDirection: 'row',
    width: '80%',
    justifyContent: 'space-around'
  }
}

export default DragDropContext(HTML5Backend)(Home)
