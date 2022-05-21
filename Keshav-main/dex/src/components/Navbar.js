import React, { Component } from 'react'
import { connect } from 'react-redux'
import { GREEN, RED } from '../helpers'

import { accountSelector, 
         exchangeSelector,
         adminAccountSelector, 
         isEmergencySelector } from '../store/selectors'

import { stopExchange, 
         startExchange, 
        } from '../store/interactions'

const EmergencySection  = (props) => {

  const { isEmergency, adminAccount, account, exchange, dispatch } = props
  const color  = isEmergency ? RED : GREEN
  const status = isEmergency ? 'Exchange Is Fully Functional!': 'Exchange is in state of Emergency!! Order cancellations and withdrawals Work'

  if(account === adminAccount) {
    return (
      <a className="navbar-brand" href="#/">
      
      </a>
    )

  } else {

    return (
      <a className="navbar-brand" href="#/">
       
      </a>
    )

  }

}

class Navbar extends Component {

  render() {

    return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-secondary">
        <a className="navbar-brand" href="#/">Exchange</a>   
        { EmergencySection(this.props)}    
   
        <ul className="navbar-nav ml-auto">   

          <li className="nav-item">
            <a
              className="nav-link small"
              href={`https://rinkeby.etherscan.io/address/${this.props.account}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {this.props.account}
            </a>
          </li>
        </ul>
      </nav>
    )
  }
}

function mapStateToProps(state) {
  return {
    account: accountSelector(state),
    isEmergency: isEmergencySelector(state),
    exchange: exchangeSelector(state),
    adminAccount: adminAccountSelector(state)
  }  
}

export default connect(mapStateToProps)(Navbar)
