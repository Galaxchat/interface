import { useCallback, useEffect, useMemo, useState,useRef } from "react";
import "react-chat-elements/dist/main.css";
import { t, Trans } from "@lingui/macro";
import { AutoColumn } from "../Column";
import { AutoRow } from "components/Row";

export default function ChatPrice(props: any) {
  const [price, setPrice] = useState<any>("");

  const { contract, account, chatRoomInfo } = props;


  useEffect(() => {
    setPrice(0.01)
  }, [contract, account, chatRoomInfo]);



  return (
    <>
      <AutoRow justify="center">
        <span className="token-price"> Price: {price} ETH</span>
      </AutoRow>
    </>
  );
}
