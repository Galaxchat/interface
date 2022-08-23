import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import "react-chat-elements/dist/main.css";
import { t, Trans } from "@lingui/macro";
import { AutoColumn } from "../Column";
import { AutoRow } from "components/Row";
import { usePairContract } from '../../hooks/useGalaxChat'
import { ButtonSecondary } from "../Button";
import Loader from "components/Loader";

export default function ChatPrice(props: any) {
  const [price, setPrice] = useState<any>();
  const [isClaim, setIsClaim] = useState<boolean>(false);


  const { account, chatRoomInfo, lpContract } = props;
  const { pair } = chatRoomInfo;
  const chatPairContract = usePairContract(pair);
  const getPrice = useCallback(async () => {
    if (chatPairContract && pair) {
      const reservers = await chatPairContract.getReserves();
      let price = reservers._reserve1 / reservers._reserve0;
      setPrice(price.toFixed(18))
    }
  }, [chatPairContract, account, chatRoomInfo, pair])

  const getTokenAmount = useCallback(async () => {
    if (account && lpContract && chatRoomInfo?.address) {
      const chatRoomAddress = chatRoomInfo.address
      const tokenAmount = await lpContract.getClaimAmount(chatRoomAddress, account)
      let tokenAmountInt = parseInt(tokenAmount.toString())
      if (tokenAmountInt > 0) {
        setIsClaim(true)
      }
    }
  }, [chatRoomInfo, account])



  useEffect(() => {
    getPrice();
    getTokenAmount();
  }, [account, chatRoomInfo]);


  return (
    <>
      <AutoRow justify="space-between">
        <span className="token-price"> Price: {price} ETH</span>
        <AutoColumn style={{display:"flex"}}>
          <ButtonSecondary style={{ width: "64px", marginLeft:"5px"}}>
            <Trans>Claim</Trans>
          </ButtonSecondary>

          <ButtonSecondary style={{ width: "64px" }}>
            <Trans>Trade</Trans>
          </ButtonSecondary>
        </AutoColumn>
      </AutoRow>
      <AutoRow justify="space-between">
        {/* <AutoColumn>
          {isClaim ? (
            <ButtonSecondary style={{ pointerEvents: "none" }}>
              <Loader />
            </ButtonSecondary>
          ) : (
            <ButtonSecondary>
              <Trans>+</Trans>
            </ButtonSecondary>
          )}
        </AutoColumn> */}
      </AutoRow>
    </>
  );
}
