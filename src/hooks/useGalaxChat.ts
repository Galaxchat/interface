import CHAT_ABI from 'abis/galax-chat-message.json'
import { GALAX_CHAT_ADDRESSES } from 'constants/addresses'
import { useContract,useERC721Contract } from 'hooks/useContract'
import { ethers } from "ethers";
import { useEffect, useState, useMemo } from "react";


// returns null on errors
export function useChatContract() {
  return useContract(GALAX_CHAT_ADDRESSES, CHAT_ABI, true)
}


export function useChatRoomInfo(address: string){
  const contract = useERC721Contract(address);
  const name =  contract?.name()
  const tokenURI = contract?.tokenURI(0);
  console.log( {name: name, tokenURI: tokenURI})
  return {name: name, tokenURI: tokenURI}
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
          const INFURA_KEY = process.env.REACT_APP_INFURA_KEY
          const provider = ethers.providers.getDefaultProvider("homestead", {infura: INFURA_KEY});
          let ensName = await provider.lookupAddress(address);
          const resolver = ensName ? await provider.getResolver(ensName) : null;
          let avatar = resolver ? await resolver.getAvatar() : undefined;
          setENSName(ensName);
          if (avatar) {
            setENSAvatar(avatar.url)
          }
        }catch(error) {
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
