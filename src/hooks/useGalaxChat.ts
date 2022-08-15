import CHAT_ABI from 'abis/galax-chat-message.json'
import { GALAX_CHAT_ADDRESSES } from 'constants/addresses'
import { useContract } from 'hooks/useContract'
import { ethers } from "ethers";
import { useEffect, useState, useMemo } from "react";
import ERC721_ABI from 'abis/erc721.json'
import { isAddress } from "../utils";
import axios from 'axios'



const INFURA_KEY = process.env.REACT_APP_INFURA_KEY
const provider = ethers.providers.getDefaultProvider("homestead", { infura: INFURA_KEY });

// returns null on errors
export function useChatContract() {
  return useContract(GALAX_CHAT_ADDRESSES, CHAT_ABI, true)
}



export function useChatRoomInfo(address: string) {
  const [roomInfo, setRoomInfo] = useState<object>()
  const isAddressSearch = isAddress(address);
  useEffect(() => {
    const resolveRoom = async () => {
      if (isAddressSearch) {
        try {
          // const provider = ethers.providers.getDefaultProvider("homestead", { infura: INFURA_KEY });
          const contract = new ethers.Contract(address, ERC721_ABI, provider);
          const name = await contract?.name()
          const tokenURI = await contract?.tokenURI(0);
          const tokenURL = tokenURI.replace("ipfs://", "https://dweb.link/ipfs/")
          let imageURL =''

          await axios.get(tokenURL)
          .then((res)=>{
            console.log(res.data.image.replace("ipfs://", "https://dweb.link/ipfs/"))
            if (res.data.image && res.data.image.startsWith("ipfs://")){
              imageURL = res.data.image.replace("ipfs://", "https://dweb.link/ipfs/")
            }
          })
          .catch((err)=>{
            console.log(err)
          })
          setRoomInfo({ name: name, imageURL: imageURL })
        } catch (err){
          // console.log("err",err)
          setRoomInfo({ name: address, imageURL: null })
        }
      } else {
        console.log("not a address")
      }
    }
    resolveRoom()
  }, [address])

  return useMemo(
    () => (roomInfo),
    [roomInfo]
  )
}

export function useDefaultENS(address: string) {
  const [ensName, setENSName] = useState<string | null>(null);
  const [ensAvatar, setENSAvatar] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const resolveENS = async () => {
      setLoading(true);
      if (address && ethers.utils.isAddress(address)) {
        try {
          // const INFURA_KEY = process.env.REACT_APP_INFURA_KEY
          // const provider = ethers.providers.getDefaultProvider("homestead", { infura: INFURA_KEY });
          let ensName = await provider.lookupAddress(address);
          const resolver = ensName ? await provider.getResolver(ensName) : null;
          let avatar = resolver ? await resolver.getAvatar() : undefined;
          setENSName(ensName);
          if (avatar) {
            setENSAvatar(avatar.url)
          }
        } catch (error) {
          console.log(error)
        }
        finally {
          setLoading(false);
        }
      }
    };
    resolveENS();
  }, [address]);

  return useMemo(
    () => ({
      ensName: ensName,
      ensAvatar: ensAvatar
    }),
    [ensName, ensAvatar]
  )

};
