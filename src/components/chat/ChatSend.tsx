import { useState, useCallback } from "react";
import { AutoRow } from "components/Row";
import { ButtonSecondary } from "../../components/Button";
import { Trans } from "@lingui/macro";
import { TransactionResponse } from "@ethersproject/abstract-provider";
import { Separator } from "components/SearchModal/styleds";

export default function ChatSend(props: any) {
  const [inputMessage, setInputMessage] = useState<string>("");

  const { chatContract, account, chatRoomAddress } = props;
  const onClickSend = useCallback(async () => {
    if (account && chatContract && chatRoomAddress) {
      chatContract
        ?.send(chatRoomAddress, account, inputMessage, {})
        .then((tx: TransactionResponse) => {
          setInputMessage("");
        })
        .catch((e: Error) => {
          console.log(e);
        });
    }
  }, [inputMessage, account, chatContract, chatRoomAddress]);

  return (
    <>
      <AutoRow>
        {/* <input type="text"
          className="form-control form-control-lg"
          placeholder="input your message"
          value={inputMessage}
          onChange={(event) => {
            setInputMessage(event.target.value)
          }}
        /> */}
        <textarea
          name="message"
          id="messageInput"
          value={inputMessage}
          placeholder="input your message"
          onChange={(event) => {
            setInputMessage(event.target.value)
          }}
          style={{ borderLeft: "none", borderRight: "none", height: "100px", width: "100%" }}
        ></textarea>
      </AutoRow>
      <Separator />
      <AutoRow style={{ marginRight: "20px", width: "60px", paddingTop:'2px' }}>
        <ButtonSecondary onClick={onClickSend}>
          <Trans>Send</Trans>
        </ButtonSecondary>
      </AutoRow>
    </>
  );
}
