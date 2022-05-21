

# End-to-end Oracle Proof of Concept using AirNode and API3 (working title)
# Concept by Bina Ramamurthy, June 1, 2021 (Confidential)


Overall goal of the research is to demonstrate the capability of the AIrNode API3 using a end-to-end system: 
API Provider —> API —> AirNode —> Oracle —> Smart Contract —> User query interaction

The research work in accomplishing this goal is divided into phases.

## Phase 1:
Study the AirNode and API3 and deploy the AirNode on Ropsten as given in the readme.md and the starter documentation. Explore the AirNode.sol (smart contract) and the three example client .sols (smart contracts) available in the GitHub code. Demonstrate the interaction to GecoCoin API using the examples using Remix web environment. Lab Demo 1- common understanding of the workflow and toolchain. 

## Phase 2: 
Add a useful client smart contract that will use the information from the API and do something with it. The transaction stored on the blockchain can be useful for provenance and governance.
A new client.sol for a useful application will replace the demonstration examples in Phase 1. Lab Demo 2 — demo a client application using oracles. Also use Weather API, average gas price API and another finance API such a Yahoo API for findng stock prices. Then apply the ideas to a decentralized exchange.

## Phase 3: 
Replace the GecoCoin API with another useful API. We are currently looking at Google Vision API that has wide range of uses from identifying the image content to explaining the characteristic of image content. For example, it can identify the sentiments (happy, sad etc.), event (running etc.), text within image (if any), and the nature of the image (adult theme, violence, racy etc.). Proof of concept for replacing Geco API with another API and updating AirNode configuration. Lab Demo 3 — demo of oraclizing Google API. 

## Phase 4: 
Add a front-end client (web clients) examples to explore the various oracles out of the Google Vision API (or xyz API). Lab Demo 4— demo the smart contract access the various features of the powerful Google Vision API through oracle service provided by the AirNode.

## Phase 5: 
Demonstrate the role of blockchain as a trust layer and an intermediary in the real world client—> smart contract —> oracles workflow. This phase demonstrates the usefulness of the blockchain as an intermediary. The hash of oracle call parameters/meta data will be stored on the chain for provenance and governance. Lab Demo 5 — Proof of concept of smart contract-based application transacting on blockchain and using services offered by Google Vision API.

## Phase 6:  
Lab Demo 6: Demonstrate the end-to-end application with web UI, with full code + documentation + medium-publishable paper.



