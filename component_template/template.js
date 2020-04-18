const main = `
class :className extends Component {
  constructor(props){
    super(props);
    this.state = {}
  }
  render(){
    return (
      <div className=":className">
        :className is working.
      </div>
    )
  }
}
`

const functional = `
const :className = (props) => {
  return (
    <div className=":className">
      :className is working.
    </div>
  )
}
`

const reducer = `
import { initialState } from './constant';
export const :classNameReducer = (state = initialState,action) => {
  switch(action.type) {
      case '':
          return {
              ...state
          }
      default:
          return state;
  }
}
`

const constant = `
export const initialState = {
}
`

const service = `
import axios from 'axios';
const :className = {
  :classNameExample: () => {
      const url = ''; // api url goes here
      return axios({
          url,
          method: "GET",
          data: '', // data values
          params: '', // queryString key: value pair
      })
  }
}

export default :className
`

const imports = {
  react: "import React, {Component} from 'react';",
  stylesheet: "import './:className.css';",
  action: "import {} from './actions.js';",
  connect: "import {connect} from 'react-redux';"
}

const exported = {
  connectDispatch: "export default connect(null, mapDispatchToProps)(:className);",
  observable: "export default (observer(:className));",
  default: "export default :className;",
  connectStateAndDispatch: `
const mapStateToProps = (state, ownProps) =>  ({});
const mapDispatchToProps = dispatch => ({});
export default connect(mapStateToProps, mapDispatchToProps)(:className);`
}

const mapStateToProps = `
const mapStateToProps = (state, ownProps) =>  { 
  return {};
};
`

const mapDispatchToProps = `
const mapDispatchToProps = dispatch => {  
  return {};
}
`

module.exports = {
  main: main,
  imports: imports,
  exported: exported,
  functional: functional,
  reducer,
  constant,
  service
}
