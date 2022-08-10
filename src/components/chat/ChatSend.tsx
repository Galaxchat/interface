import React, { useContext, useState, useCallback } from "react";
import { AutoColumn } from "../../components/Column";
import { AutoRow } from "../../components/Row";
import { TextInput, ResizingTextArea } from "components/TextInput";
import Loader from "../../components/Loader";
import {
  BaseButton,
  ButtonConfirmed,
  ButtonError,
  ButtonLight,
  ButtonPrimary,
  ButtonSecondary,
} from "../../components/Button";
import { t, Trans } from "@lingui/macro";
import { TransactionResponse } from "@ethersproject/abstract-provider"

export default function ChatSend(props: any) {
  const [inputMessage, setInputMessage] = useState<string>("");

  const { chatContract, account, chatRoomAddress } = props
  const onClickSend = useCallback(async () => {
    console.log("click send button");
    console.log("inputMessage:", inputMessage);
    console.log("chatContract props:", props);
    if (account && chatContract) {
      chatContract?.send(chatRoomAddress, account, inputMessage, {})
        .then((tx: TransactionResponse) => {
          console.log(tx)
          setInputMessage("")
        }).catch((e: Error) => console.log(e))
    }
  }, [inputMessage]);

  return (
    <>
      <AutoColumn>
        <input type="text"
          className="form-control form-control-lg"
          placeholder="input your message"
          value={inputMessage}
          onChange={(event) => {
            setInputMessage(event.target.value)
          }}
        />
      </AutoColumn>
      <AutoColumn style={{ marginLeft: '10px' }}>
        <ButtonSecondary onClick={onClickSend}>
          <Trans>send</Trans>
        </ButtonSecondary>
      </AutoColumn>
    </>
  )
}

