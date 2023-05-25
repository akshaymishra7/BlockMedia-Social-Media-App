import React, { useState , useEffect } from "react";
import "./TweetBox.css";
import Avatar from 'avataaars';
import { generateRandomAvatarOptions } from './avatar';
import { Button } from "@material-ui/core";
import axios from 'axios';
import { TwitterContractAddress } from './config.js';
import {ethers} from 'ethers';
import Twitter from './utils/TwitterContract.json'

function TweetBox({setImagesFunc}) {
  const [tweetMessage, setTweetMessage] = useState("");
  const [tweetImage, setTweetImage] = useState("");
  const [avatarOptions, setAvatarOptions] = useState("");
  const [fileImg, setFileImg] = useState(null);
  const [arr,setArr]=useState([]);
  const [flag,setFlag]=useState(false);

  const sendFileToIPFS = async (e) => {
    e.preventDefault();
    if (fileImg) {
        try {

            const formData = new FormData();
            formData.append("file", fileImg);

            const resFile = await axios({
                method: "post",
                url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
                data: formData,
                headers: {
                    'pinata_api_key': "5fcb6af53ab5e7946919",
                    'pinata_secret_api_key': "785e7955f1c16fdc2704667d733f2e92a709db8a52032ebb9ded0da124532133",
                    "Content-Type": "multipart/form-data"
                },
            });

            const ImgHash = `https://gateway.pinata.cloud/ipfs/${resFile.data.IpfsHash}`;
            console.log(ImgHash); 

            setArr((val)=>[...val,ImgHash]);
            
//Take a look at your Pinata Pinned section, you will see a new file added to you list.   

        } catch (error) {
            console.log("Error sending File to IPFS: ")
            console.log(error)
        }
    }
}

  const addTweet = async () => {
    let tweet = {
      'tweetText': tweetMessage,
      'isDeleted': false
    };

    try {
      const {ethereum} = window

      if(ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const TwitterContract = new ethers.Contract(
          TwitterContractAddress,
          Twitter.abi,
          signer
        )

        let twitterTx = await TwitterContract.addTweet(tweet.tweetText, tweet.isDeleted);

        console.log(twitterTx);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch(error) {
      console.log("Error submitting new Tweet", error);
    }
  }

  const sendTweet = (e) => {
    e.preventDefault();

    addTweet();

    setTweetMessage("");
    setTweetImage("");
  };

  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    let avatar = generateRandomAvatarOptions();
    setAvatarOptions(avatar);
  }, []);


  const fetchImagesFromPinata = async () => {
    try {
      // const response = await axios.get('https://api.pinata.cloud/data/pinListEndpoint', {
      //   headers: {
      //     'Content-Type': 'application/json',
          
      //     'pinata_api_key': "5fcb6af53ab5e7946919",
      //     'pinata_secret_api_key': "785e7955f1c16fdc2704667d733f2e92a709db8a52032ebb9ded0da124532133",
      //   }
      // });
      const response = await axios.get('https://api.pinata.cloud/data/pinList', {
        headers: {
          pinata_api_key: '5fcb6af53ab5e7946919',
          pinata_secret_api_key: '785e7955f1c16fdc2704667d733f2e92a709db8a52032ebb9ded0da124532133',
        },
      });

      // Process the response and extract the image URLs
      const imageUrls = response.data.rows.map(row => `https://gateway.pinata.cloud/ipfs/${row.ipfs_pin_hash}`);
  
      // Update the state with the image URLs
      // const imgUrl=`https://gateway.pinata.cloud/ipfs/${resFile.data.IpfsHash}`
      setImagesFunc(imageUrls);
    } catch (error) {
      console.error('Error fetching images from Pinata:', error);
    }
  };

  useEffect(() => {
    fetchImagesFromPinata();
  }, []);
  
  return (
    <div className="tweetBox">
      <form>
        <div className="tweetBox__input">
          <Avatar
            style={{ width: '100px', height: '100px' }}
            avatarStyle='Circle'
            {...avatarOptions }
          />
          <input
            onChange={(e) => setTweetMessage(e.target.value)}
            value={tweetMessage}
            placeholder="What's happening?"
            type="text"
          />
        </div>
        {/* <input
          value={tweetImage}
          onChange={(e) => setTweetImage(e.target.value)}
          className="tweetBox__imageInput"
          placeholder="Optional: Enter image URL"
          type="text"
        /> */}
        <Button
          onClick={sendTweet}
          type="submit"
          className="tweetBox__tweetButton"
        >
          Tweet
        </Button>
      </form>
      <p className="tweetBox__imageInput2">OR</p>

      <form className="nftForm" onSubmit={sendFileToIPFS}>
<input className="chooseFile" type="file" onChange={(e) =>setFileImg(e.target.files[0])} required />
<button type='submit' className="tweetBox__mintButton">Mint NFT</button>            
</form>
{/* <img src="https://gateway.pinata.cloud/ipfs/QmWfSz2caon2xzcsY1kPYWiY341CbZ8Zt3vE6DenhexHbd" width="130px"/> */}

    </div>
  );
}

export default TweetBox;
