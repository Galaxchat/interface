import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import "react-chat-elements/dist/main.css";
import { t, Trans } from "@lingui/macro";
import { AutoColumn } from "../Column";
import { AutoRow } from "components/Row";
import { usePairContract } from '../../hooks/useGalaxChat'
import { ButtonSecondary } from "../Button";
import Loader from "components/Loader";
import ChatModalType from "./ChatModalType";

export default function ChatPrice(props: any) {
  const [price, setPrice] = useState<any>();
  const [isClaim, setIsClaim] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [modalType, setModalType] = useState<string>("");
  const [info, setInfo] = useState<string>("");
  const [claimed, setClaimed] = useState<boolean>(false);

  const { account, chatRoomInfo, lpContract } = props;
  const { pair } = chatRoomInfo;
  const chatPairContract = usePairContract(pair);
  const getPrice = useCallback(async () => {
    if (chatPairContract && pair) {
      const reservers = await chatPairContract.getReserves();
      let price = reservers._reserve1 / reservers._reserve0;
      setPrice(price.toFixed(18));
    }
  }, [chatPairContract, account, chatRoomInfo, pair])

  const getTokenAmount = useCallback(async () => {
    if (account && lpContract && chatRoomInfo?.address) {
      const chatRoomAddress = chatRoomInfo.address;
      const tokenAmount = await lpContract.getClaimAmount(chatRoomAddress, account);
      let tokenAmountInt = parseInt(tokenAmount.toString());
      if (tokenAmountInt > 0) {
        setIsClaim(true)
      }
    }
  }, [chatRoomInfo, account, lpContract])

  const getClaimed = useCallback(async () => {
    if (account && lpContract && chatRoomInfo?.address) {
      const chatRoomAddress = chatRoomInfo.address;
      const claimed = await lpContract.claimed(chatRoomAddress, account);
      setClaimed(claimed)
    }
  }, [chatRoomInfo, account, lpContract])


  const onClickClaim = useCallback(async () => {
    if (lpContract && account && chatRoomInfo?.address) {
      setLoading(true);
      try {
      const chatRoomAddress = chatRoomInfo.address;
      const claim = await lpContract.claim(chatRoomAddress);
      console.log(claim);
      claim.wait().then( (receipt:any)=>{
        setLoading(false)
        setClaimed(true)
      })
      } catch (e) {
        setLoading(false);
        setModalType("transactionError");
        const text = e.message
        setInfo(text)
        setIsOpen(true);
      }
    }
  }, [account, lpContract, chatRoomInfo])

  useEffect(() => {
    getPrice();
    getTokenAmount();
    getClaimed();
  }, [account, chatRoomInfo, lpContract, chatPairContract]);


  return (
    <>
      <AutoRow justify="center">
        <span className="token-price"> Token Price: {price} ETH</span>
        <AutoColumn style={{ display: "flex" }}>
          {loading ?
            <ButtonSecondary style={{ pointerEvents: "none", marginLeft: "8px" }}>
              <Loader />
            </ButtonSecondary> :
            isClaim && !claimed ?
            <ButtonSecondary
              style={{ marginLeft: "8px" }}
              onClick={onClickClaim}
            >
              <Trans>Claim</Trans>
            </ButtonSecondary> :
            null
          }

          <ButtonSecondary 
          style={{ marginLeft: "3px" }}
          onClick= {()=>{
            window.open("https://app.uniswap.org/#/swap")}}
          >
            <Trans>Trade</Trans>
          </ButtonSecondary>
        </AutoColumn>
      </AutoRow>
      
      {modalType ?
        <ChatModalType
          showModal={(open: boolean) => { setIsOpen(open) }}
          type={modalType}
          isOpen={isOpen}
          info={info}
        />
        : null
      }
    </>
  );
}
