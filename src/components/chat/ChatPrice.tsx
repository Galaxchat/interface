import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import "react-chat-elements/dist/main.css";
import { t, Trans } from "@lingui/macro";
import { AutoColumn } from "../Column";
import { AutoRow } from "components/Row";
import { usePairContract } from '../../hooks/useGalaxChat'

export default function ChatPrice(props: any) {
  const [price, setPrice] = useState<any>();

  const { account, chatRoomInfo } = props;

  const { pair } = chatRoomInfo;
  const chatPairContract = usePairContract(pair);

  const getPrice = useCallback(async () => {
    if (chatPairContract && pair) {
        const reservers = await chatPairContract.getReserves();
        let price = reservers._reserve1 / reservers._reserve0;
        setPrice(price.toFixed(18))
    }
  }, [chatPairContract, account, chatRoomInfo, pair])

  useEffect(() => {
    getPrice();
  }, [account, chatRoomInfo]);



  return (
    <>
      <AutoRow justify="center">
        <span className="token-price"> Price: {price} ETH</span>
      </AutoRow>
    </>
  );
}
