import { useState, useCallback } from "react";
import { AutoColumn } from "../../components/Column";
import { ButtonSecondary, } from "../../components/Button";
import { Trans } from "@lingui/macro";
import { TransactionResponse } from "@ethersproject/abstract-provider"

export default function ChatSend(props: any) {
  const [inputMessage, setInputMessage] = useState<string>("");

  const { chatContract, account, chatRoomAddress } = props
  const onClickSend = useCallback(async () => {
    if (account && chatContract && chatRoomAddress) {
      chatContract?.send(chatRoomAddress, account, inputMessage, {})
        .then((tx: TransactionResponse) => {
          console.log(tx)
          setInputMessage("")
        }).catch((e: Error) => {
          console.log(e)
          
        })
    }
  }, [inputMessage, account, chatContract,  chatRoomAddress ]);

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
          <Trans>Send</Trans>
        </ButtonSecondary>
      </AutoColumn>
    </>
  )
}

