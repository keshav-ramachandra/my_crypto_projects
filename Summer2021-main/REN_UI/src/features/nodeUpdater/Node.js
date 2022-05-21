import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Container, Row, Col } from 'react-bootstrap';
import web3 from './../web3'

import Select from 'react-select';

import {
  getBalanceAsync,
  getUserAsync,
  getNodeAsync,
  getDepositStatusAsync,
  updateNodeStats,
  isOwner,
  createNodeAsync,
  loadSelectElements,
  stakeRenAsync
} from './nodeSlice';
import styles from './Node.module.css';

export function Node() {
  //const fetchStatus = useSelector(state => state.node.status)
  //const error = useSelector(state => state.node.error)
  




  const dispatch = useDispatch();
  const user = useSelector(state => state.node.user);
  const currentNode = useSelector(state => state.node.currentNode);
  const balance = useSelector(state => state.node.balance);
  //const [user, setUser] = useState(null);
  //const [amount, setAmount] = useState(0);
  const [incrementAmount, setIncrementAmount] = useState(5000);

  const options = useSelector(state => state.node.options);
  //dispatch(getUserAsync());
  const status = useSelector(state => state.node.status) 
  const depositStatus = useSelector(state => state.node.depositStatus) 
  const nodeBalance = useSelector(state => state.node.balance)
  const owner = useSelector(state => state.node.owner)
  const share = useSelector(state => state.node.share)

  const [selectedOption, setSelectedOption] = useState(null);
  const handleChange = (selectedOption) => {
    setSelectedOption(selectedOption);
    console.log(selectedOption.value);
    dispatch(updateNodeStats({_nodeId:parseInt(selectedOption.value)}))
     //this prints the selected option
  }

   useEffect(() => {
      dispatch(getUserAsync())
      dispatch(isOwner())
      dispatch(updateNodeStats({_nodeId:-1}))
      dispatch(loadSelectElements())

      async function listenMMAccount() {
        window.ethereum.on("accountsChanged", async function() {
          // Time to reload your interface with accounts[0]!
         const  accounts = await web3.eth.getAccounts();
          dispatch(getUserAsync())
          dispatch(updateNodeStats({_nodeId:parseInt(currentNode)}))
        });
      }
    listenMMAccount();
  
  }, [])

  
  
  let content

  if (owner == 'yes' && depositStatus == 'full') {
    content = <Row className={styles.but_ui}><button onClick= { () => dispatch(createNodeAsync(user))}>Create Node</button></Row>
  }
  else if(owner == 'no' && depositStatus == 'full'){
    content = <Row className={styles.err_text}>Owner yet to create a Node</Row>
  }
  else{
    content = <Row className={styles.but_ui}>
    <input
          className={styles.textbox}
          aria-label="Set increment amount"
          value={incrementAmount}
          onChange={(e) => setIncrementAmount(e.target.value)}
        />
  
    <button className={styles.deposit} onClick= { () => { dispatch(stakeRenAsync({incrementAmount, currentNode,user})); }  }>Stake Ren</button>
    </Row>
  }


  return (
  
    
     <Container className={styles.node}>
          <Select
            value={selectedOption}
            onChange={handleChange}
            options={options}
          />
        <Row><Col className={styles.attribute}>User:</Col> <Col className={styles.attr_small}>{user}</Col></Row>
        <Row><Col className={styles.attribute}>Node id:</Col> <Col className={styles.attr_value}>{currentNode}</Col></Row>
        <Row><Col className={styles.attribute}>Node Balance:</Col> <Col className={styles.attr_value}>{nodeBalance}</Col></Row>
        <Row><Col className={styles.attribute}>deposit Status:</Col> <Col className={styles.attr_value}>{depositStatus} </Col></Row>
        <Row><Col className={styles.attribute}>owner:</Col> <Col className={styles.attr_value}>{owner}</Col></Row>
        <Row><Col className={styles.attribute}>My Share:</Col> <Col className={styles.attr_value}>{share}</Col></Row>
        {content}
        
    </Container>

  )
}
