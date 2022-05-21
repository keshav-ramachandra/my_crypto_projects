import { createSlice, nanoid, createAsyncThunk } from '@reduxjs/toolkit'
import controller from '../controller'
import web3 from './../web3'





export const getUserAsync = createAsyncThunk('node/getUserAsync', async () => {
  const acts = await web3.eth.getAccounts(); 
  return acts[0];
})

export const loadSelectElements = createAsyncThunk('node/loadSelectElements', async () => {
  const response = await controller.methods.nodeCount().call();
  const options = [];
  for(var i=0;i < response;i++){
      options.push({ value: i, label: i })
  }
  return options;
})

export const getBalanceAsync = createAsyncThunk('node/getBalanceAsync', async (_nodeId) => {
  const response = await controller.methods.getCumulativeNodeDeposit(_nodeId).call();
  return response;
})

export const updateCurrentNodeAsync = createAsyncThunk('node/updateCurrentNodeAsync', async (_nodeId) => {
  return parseInt(_nodeId);
})


export const stakeRenAsync = createAsyncThunk('node/stakeRenAsync', async (data) => {
  //const {_amount,_nodeId,_sender}= data;
  await controller.methods.stakeRen(parseInt(data.incrementAmount),parseInt(data.currentNode)).send({from:data.user});

  
  const nodeBalance = await controller.methods.getCumulativeNodeDeposit(data.currentNode).call();
  let status
  if(parseInt(nodeBalance) == 50000){
    status = 'full';
  }
  else{
    status = 'accepting';
  }

  

  const share = await controller.methods.getMyCumulativeNodeDeposit(parseInt(data.currentNode)).call({from:data.user});

  return {nodeId: data.currentNode, nodeBalance: nodeBalance, status: status, share:share}
})


export const createNodeAsync = createAsyncThunk('node/createNodeAsync', async (_user) => {
  const response = await controller.methods.createNode().send({from:_user});
  return response;
})

export const getNodeAsync = createAsyncThunk('node/getNodeAsync', async () => {
  const response = await controller.methods.nodeCount().call();
  return parseInt(response)-1;
})

export const getDepositStatusAsync = createAsyncThunk('node/getDepositStatusAsync',async() => {
  const currentNodeBalance = getBalanceAsync(getNodeAsync());
  if(parseInt(currentNodeBalance) == 50000){
    return 'full';
  }
  else{
    return 'accepting';
  }
})

export const updateNodeStats = createAsyncThunk('node/updateNodeStats', async (data) => {
  const response = await controller.methods.nodeCount().call();
  
  let nodeId 
  if(data._nodeId == -1){
    nodeId= parseInt(response) - 1;
  }
  else{
    nodeId = parseInt(data._nodeId)
  }
  const nodeBalance = await controller.methods.getCumulativeNodeDeposit(nodeId).call();
  let status
  if(parseInt(nodeBalance) == 50000){
    status = 'full';
  }
  else{
    status = 'accepting';
  }

  const acts = await web3.eth.getAccounts();
  console.log("user is", acts[0])


  const share = await controller.methods.getMyCumulativeNodeDeposit(nodeId).call({from:acts[0]});

  return {nodeId: nodeId, nodeBalance: nodeBalance, status: status,share:share}
})



export const isOwner = createAsyncThunk('node/isOwner', async (_user) => {
  const response = await controller.methods.owner().call();
  const acts = await web3.eth.getAccounts(); 

  if(response == acts[0]){
    return 'yes';
  }
  else{
    return 'no';
  }
  
})



let initialState= {
      balance: -1,
      status:'idle',
      error:'',
      currentNode: -1,
      user:'',
      owner:false,
      depositStatus:'full',
      share:0,
      options:[]
    }
const nodeSlice = createSlice({
    name: 'node',
    initialState,
    reducers: {
      // omit existing reducers here
    },
    extraReducers: (builder) => {
      // Add reducers for additional action types here, and handle loading state as needed
      builder.addCase(getUserAsync.fulfilled, (state, action) => {
        // Add user to the state array
        state.status = 'succeeded'
        state.user = action.payload

      })
      .addCase(getBalanceAsync.fulfilled, (state, action) => {
        // Add user to the state array
        state.status = 'succeeded'
        state.balance = action.payload
      })
      .addCase(getNodeAsync.fulfilled, (state, action) => {
        // Add user to the state array
        state.status = 'succeeded'
        state.currentNode = action.payload
      })
      .addCase(getDepositStatusAsync.fulfilled, (state, action) => {
        // Add user to the state array
        state.status = 'succeeded'
        state.depositStatus = action.payload
      })
      .addCase(updateNodeStats.fulfilled, (state, action) => {
        // Add user to the state array
        state.depositStatus = action.payload.status
        state.balance = action.payload.nodeBalance
        state.currentNode = action.payload.nodeId
        state.share = action.payload.share
        state.status ='func'
      })
      .addCase(isOwner.fulfilled, (state, action) => {
        // Add user to the state array
        state.owner = action.payload
      })
      .addCase(loadSelectElements.fulfilled, (state, action) => {
        // Add user to the state array
        state.options = action.payload
      })
      .addCase(stakeRenAsync.fulfilled, (state, action) => {
        // Add user to the state array
        state.depositStatus = action.payload.status
        state.balance = action.payload.nodeBalance
        state.currentNode = action.payload.nodeId
        state.share = action.payload.share
        state.status ='func'
      })
      
    }
})


  export default nodeSlice.reducer