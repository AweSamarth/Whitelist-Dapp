import Head from 'next/head';
import Image from 'next/image';
import { useEffect, useState, useRef } from 'react';
import styles from '../styles/Home.module.css';
import Web3Modal from "web3modal";
import {Contract, providers} from "ethers";
import { WHITELIST_CONTRACT_ADDRESS, abi } from '../constants';

export default function Home() {



  const [numOfWhiteListed, setNumOfWhitelisted]=useState(0);
  const [walletConnected, setWalletConnected]=useState(false);
  const web3ModalRef=useRef();
  const[joinedWhitelist, setJoinedWhitelist]=useState(false);
  const[loading, setLoading]=useState(false);


  const getProviderOrSigner=async(needSigner=false)=>{
    try{
      const provider=await web3ModalRef.current.connect();
      const web3Provider=new providers.Web3Provider(provider);

      const{chainId}=await web3Provider.getNetwork();
      if (chainId!==4){
        window.alert("Change the network to Rinkeby");
        throw new Error("Change the network to Rinkeby")
      }
    if(needSigner){
      const signer=web3Provider.getSigner();
      console.log(signer)

      return signer;
    }
    return web3Provider;
    }catch(err){
      console.error(err);
    }
  };

  const checkIfAddressIsWhitelisted=async()=>{  
    try{
      
      const signer=await getProviderOrSigner(true)
      const whitelistContract=new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        abi,
        signer 
      );
      const address=await signer.getAddress();
      
      const _joinedWhitelist=await whitelistContract.whitelistedAddresses(
        address
      );
        setJoinedWhitelist(_joinedWhitelist); 

    }catch(err){
      console.error(err)
    }
  };

  const addAddressToWhitelist=async()=>{
    try{
      const signer = await getProviderOrSigner(true);
      const whitelistContract=new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        abi,
        signer
      );
      const tx=await whitelistContract.addAddresstoWhiteList()
      setLoading(true)
      await tx.wait();
      setLoading(false);
      await getNumberofWhitelisted();
      setJoinedWhitelist(true);
    }catch(err){
      console.error(err)
    }
  }
  const getNumberofWhitelisted=async()=>{
    try{
      const provider=await getProviderOrSigner();
      const whitelistContract=new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        abi,
        provider
      );
        const _numOfWhiteListed=
        await whitelistContract.numAddressesWhiteListed();
        setNumOfWhitelisted(_numOfWhiteListed);
    }
    catch(err){
      console.error(err);
    }
  };
const renderButton=()=> {
  if(walletConnected){
    if(joinedWhitelist){
      return(
        <div className={styles.description}>Thanks for joining the whitelist!</div>
      );
    }else{
      return(
        <button onClick={addAddressToWhitelist} className={styles.button}>Join the whitelist</button>
      );
    }
  }else if(loading){
    return <button className={styles.button}>Loading....</button>;
  }else{
    return(
    <button onClick={connectWallet} className={styles.button}>Connect your wallet</button>);
  }
};
  const connectWallet=async()=>{
    try{
      await getProviderOrSigner();
      setWalletConnected(true);
      checkIfAddressIsWhitelisted();
      getNumberofWhitelisted();

    }
    catch(err){
      console.error(err)

    }
  };

  useEffect(()=>{
    if(!walletConnected){
      web3ModalRef.current= new Web3Modal({
        network:"rinkeby",
        providerOptions:{},
        disabledInjectedProvider: false,
      });
      connectWallet();
    }

  }, [walletConnected])
  return (
    <div>
      <Head>
      <title>Whitelist dApp</title>
      <meta name="description" content="Whitelist-Dapp" />
      <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.main}>
        <div>
        <h1 className={styles.title}>Welcome to Crypto Devs!</h1>

        <div className={styles.description}>
          It's an NFT collection for developers in crypto
        </div>
        <div className={styles.description}>

          {numOfWhiteListed} have already joined the whitelist
        </div>
        {renderButton()}
      </div>
      <div> 
      
        <img className={styles.image} src="./crypto-devs.svg" />
      </div>

      </div>
      <footer className={styles.footer}>
        Made with &#10084; by Crypto Devs


      </footer>
    </div>
  );
}
