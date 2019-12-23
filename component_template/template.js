const main = `
class :className extends Component {
  constructor(props){
    super(props);
  }
  render(){
    return (
      <div className=":className">
        :className is working.
      </div>
    )
  }
}
:className.propTypes = {
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
:className.propTypes = {
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

const imports = {
  react: "import React, {Component} from 'react';",
  propTypes: "import PropTypes from 'prop-types';",
  stylesheet: "import './:className.css';",
  action: "import * as _actions from './action.js';",
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
  constant
}
