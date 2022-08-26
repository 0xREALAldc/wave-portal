import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import './App.css';
import abi from './utils/WavePortal.json';

export default function App() {

  //uma variavel de estado para armazenar a carteira publica do usuario
  const [currentAccount, setCurrentAccount] = useState("");
  const [eth, setEth] = useState(""); //teste
  const [allWaves, setAllWaves] = useState([]);

  const contractAddress = "0xc05FFF93F15cf2e45e02dAE38b1F3bB16f21cEDE";
  const contractABI = abi.abi;

  const getAllWaves = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        const waves = await wavePortalContract.getAllWaves();

        //we get only the address, date/time and message to display 
        let wavesCleaned = [];
        waves.forEach(wave => {
          wavesCleaned.push({
            address: wave.waver, 
            timestamp: new Date(wave.timestamp * 1000),
            message: wave.message
          });
        });

        wavesCleaned.sort((a,b) => { return new Date(b.timestamp) - new Date(a.timestamp)})

        //we store in the state
        setAllWaves(wavesCleaned);
      } else {
        console.log("Ethereum object doesnt exists!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkIfWalletIsConnected = async () => {
    try {
      // primeiro checamos se temos acesso ao objeto window.ethereum
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Garanta que voce possua a metamask instalada!");
        alert("Garanta que voce possua a metamask instalada!");
        return;
      } 

      setEth(ethereum); //teste

      //confirmar se estamos autorizados a utilizar a carteira do usuario
      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0 ){ 
        const account = accounts[0];
        setCurrentAccount(account);

        getAllWaves();
      } else {
        console.log("Nenhuma conta autorizada foi encontrada");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // metodo para conexao da carteira
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Metamask nao encontrada!");
        return;
      }

      setEth(ethereum); //teste

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      
      console.log("Conectado", accounts[0]);
      setCurrentAccount(accounts[0]);

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  // useEffect(() => {
  //   checkIfWalletIsConnected();
  // }, [allWaves]);

  useEffect(() => { 
    let wavePortalContract;

    const onNewWave = (from, timestamp, message) => {
      console.log("NewWave", from, timestamp, message);
      setAllWaves(prevState => [
        ...prevState, 
        {
          address: from,
          timestamp: new Date(timestamp * 1000),
          message: message,
        },
      ]);
    };

    allWaves.sort((a,b) => { return new Date(b.timestamp) - new Date(a.timestamp)})
    setAllWaves(allWaves);

    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
      wavePortalContract.on("NewWave", onNewWave);
    }

    return () => {
      if (wavePortalContract) {
        wavePortalContract.off("NewWave", onNewWave);
      }
    };
  }, []);

  const wave = async (message) => {
    try {
      // const { ethereum } = window; 
      if (eth) {
        const provider = new ethers.providers.Web3Provider(eth);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await wavePortalContract.getTotalWaves();
        console.log("Recuperando o numero total de waves....", count.toNumber());

        const waveTx = await wavePortalContract.wave(message, { gasLimit: 300000 });
        console.log("Minerando...", waveTx.hash);

        await waveTx.wait();
        console.log("Minerando -- ", waveTx.hash);

        count = await wavePortalContract.getTotalWaves();
        console.log("Total waves recuperados... ", count.toNumber());

        document.getElementById('message').value = '';
      } else {
        console.log("Objeto ethereum nao encontrado!");
      }
    } catch (error) {
      console.log(error);
    }
  };
  
  return (
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header">
        👋 Hi there, good to see you here!
        </div>

        <div className="bio">
        I'm André, a software developer currently working with DELPHI but eager to learn more about web3. Connect your ethereum wallet and send me a message
        with a wave! 
        </div>

        {currentAccount && 
        (  
          <input type="text" placeholder="Write your kind message here...." name="message" id="message"/>
        )}

        {currentAccount && 
        (  
          <button className="waveButton" onClick={() => wave(document.getElementById('message').value)}>
            Send a wave 🌟
          </button>
        )}

        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Wallet connect
          </button>
        )}

        {allWaves.map((wave, index) => {
          return(
            <div key={index} style={{ backgroundColor: "OldLace", marginTop: "16px", padding: "8px"}}>
              <div>Address: {wave.address}</div>
              <div>Timestamp: {wave.timestamp.toString()}</div>
              <div>Message: {wave.message}</div>
            </div>)
        })}
      </div>
    </div>
  );
}
