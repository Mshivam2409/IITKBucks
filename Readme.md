# Overview
In this project we built a custom cryptocurrency using a blockchain model.
 Everyone developed their own node. The model can be used for secure 
transactions that can be verified by anyone without the need of a 
central body. A major advantage of such a network is that it maintains 
strict anonymity, as a public key is all that is needed to make a 
transaction.</span></p><h1 class="c8" id="h.ogp52fyi6djo"><span>Goals</span></h1><ol class="c7 lst-kix_4yitvg6is1o9-0 start" start="1">
<li class="c4"><span class="c9">Understanding the working of blockchains</span><span class="c9">:</span><span class="c3">&nbsp;One
 of our aims was to understand terms like target, mining etc., and to 
learn about how the history of a blockchain is practically unmodifiable 
even though it is publicly available.</span></li>
<li class="c4"><span class="c9">Understanding practical application of modern cryptography:</span><span class="c3">&nbsp;We
 also aimed to analyze the use of cryptographic methods like hash 
calculation, and the usage of digital signatures to prove ownership.</span></li>
<li class="c4"><span class="c9">Understanding peer-to-peer networks:</span><span class="c3">&nbsp;We
 tried to learn how independent nodes in a P2P network function without 
the need of any supervising body, and why a single peer cannot go 
against the majority consensus.</span></li>
<li class="c4"><span class="c9">Implementing a large project:</span><span class="c3">&nbsp;We
 gained hands-on experience of the development of multithreaded 
applications, and were introduced to the entire workflow of building 
such a large project from scratch.</span></li></ol><h1 class="c8" id="h.ksmxnrgo4jdp"><span class="c21">What we did</span></h1><p class="c12"><span class="c3">We
 first built various parts of the application singularly as assignments.
 Then all of us built our own node. The nodes can be deployed on any 
computer and tunnelled through ngrok to get a hostname. We also built an
 interaction tool to help end users to make transactions. The 
interaction tool can be deployed or run separate from the miner. It only
 needs the url of any one node, to which it will send the request.</span></p><h1 class="c8" id="h.1pw1ma28yzdz"<h1 class="c8" id="h.eabioqb61ruv"><span>Implementation</span></h1><ol class="c7 lst-kix_a4kpffjoh5fu-0 start" start="1">
<li class="c15"><h1 id="h.68p0ebcw463j" style="display:inline"><span class="c11">Nodes</span></h1></li></ol><p class="c12"><span>All
 of us built our own nodes, in a language of our preference, following 
the API specification given below.This node has been developed in Typescript.</span></p><ol class="c7 lst-kix_a4kpffjoh5fu-0" start="2">
<li class="c15"><h1 id="h.itmqxijtyrft" style="display:inline"><span class="c16">API Documentation</span></h1></li></ol><p class="c12"><span>We implemented the following endpoints in our nodes:</span></p><ul class="c7 lst-kix_bns4257o33py-0 start">
<li class="c4"><span class="c3">POST - /newBlock - accepts a new block to be added to the blockchain</span></li>
<li class="c4"><span class="c3">POST - /newPeer - accepts a request to connect to a peer</span></li>
<li class="c4"><span class="c3">GET - /getPeers - returns the list of current peers of the respective server</span></li>
<li class="c4"><span class="c3">GET - /getBlock/&lt;index&gt; - returns the block at the this index, in the current blockchain</span></li>
<li class="c4"><span class="c3">GET - /getPendingTransactions - returns the list of transactions that are yet to be mined</span></li>
<li class="c4"><span class="c3">POST - /newTransaction - accepts a new transaction which now needs to be mined</span></li>
<li class="c4"><span class="c3">POST - /getUnusedOutputs - returns the unused outputs of the key/alias given as input</span></li>
<li class="c4"><span class="c3">POST - /addAlias - adds alias for a public key</span></li>
<li class="c4"><span>POST - /getPublicKey - returns the public key of an alias<br></span></li></ul><ol class="c7 lst-kix_a4kpffjoh5fu-0" start="3">
<li class="c15"><h1 id="h.82urgs2pm5bw" style="display:inline"><span class="c16">Miner</span></h1></li></ol><p class="c12"><span>The
 part for mining a new block had to run in parallel with the HTTP 
server. In order to prevent the main thread from blocking, we needed to 
implement multithreading in our applications. For this purpose, we used 
worker threads in Javascript.</span></p><ol class="c7 lst-kix_a4kpffjoh5fu-0" start="4">
<li class="c15"><h1 id="h.z4ma5gee9dtj" style="display:inline"><span class="c16">Frontend</span></h1></li></ol><p class="c12"><span class="c3">The
 frontend is the part with which the user interacts. The fronted is the react app located in the folder frontend.</span></p>
 
 
# Deployment
The nodes can be deployed as and when required. They will pick up the 
chain from one of the peers and can start building the chain further.
To run the nodes in development mode configure the peers list, install the respective dependencies and run :
```
docker compose -f "docker-compose.dev.yml" -up --build
```
