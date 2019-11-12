import React from 'react';
import './index.css';
import { API, graphqlOperation, Storage } from 'aws-amplify';
import { createVodAsset } from '../../graphql/mutations';
import FilePicker from './../FilePicker'

class Admin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {value: '', titleVal: '', lenVal:'',descVal:''};
        this.submitFormHandler = this.submitFormHandler.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleLenChange = this.handleLenChange.bind(this);
    }

    componentDidMount(){

    }

    handleChange(event) {
      const value = event.target.value;
      const name = event.target.name;

      this.setState({
        [name]:value
      });
    }
    myCallback = (dataFromChild) => {
        var f = dataFromChild;
        console.log("help me" + dataFromChild + "_" + dataFromChild.name);
        this.setState({
          file: dataFromChild,
          fileName: dataFromChild.name
        });
        console.log("help me2" + this.state.file + "_" + this.state.fileName);
    }
    handledescChange(event) {
        this.setState({descVal: event.target.value});
    }
    handleLenChange(event) {
        this.setState({lenVal: event.target.value});
    }
    submitFormHandler(event){

    }
    render() {
        return (      
        <div class="App-header">
        	<h1>Admin Panel</h1>
	        <form onSubmit={this.submitFormHandler}>
	          <div>
	          	Title: <input type="text" value={this.state.titleVal} name="titleVal" onChange={this.handleChange}/><br/>
	          	Length: <input type="text" value={this.state.lenVal} name="lenVal" onChange={this.handleChange}/><br/>
	          	Description: <br/><textarea rows="4" cols="50" value={this.state.descVal} name="descVal" onChange={this.handleChange}></textarea><br/>
	            <FilePicker callbackFromParent={this.myCallback}/>
	            <input type="submit" value="Submit" />
	          </div>
	        </form>
      	</div>
      )
    }
}

export default Admin;

