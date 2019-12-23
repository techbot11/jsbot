import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { fetchData, fetchDataLoading } from './actions';
import { rootURL } from './constants';
import logo from '../../Assets/logo.png';
import Loader from '../loader';

class Home extends React.PureComponent {
    componentDidMount() {
        this.props.fetchData(rootURL)
    }
    render() {
        const { itemLoading } = this.props
        if (itemLoading) {
            return <Loader />
        }
        return (
            <div className="App">
                <header className="App-header">
                    <h3>Hello!, Welcome to JSBot</h3>
                    <img src={logo} className="App-logo" alt="logo" />
                    <p>
                        Edit <code>src/App.js</code> and save to reload.
                    </p>
                    <a
                        className="App-link"
                        href="https://reactjs.org"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Learn React
                    </a>
                </header>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    console.log('MSTP : ', state.itemLoading)
    return {
        itemReducer: state.items,
        itemLoading: state.itemLoading,
        itemLoadingError: state
    }
}

const mapDispatchToProps = dispatch => bindActionCreators(
    {
        fetchData,
        fetchDataLoading
    },
    dispatch
)

export default connect(mapStateToProps, mapDispatchToProps)(Home);