import { useState, useCallback } from "react";
import { AutoRow } from "components/Row";
import { ButtonSecondary, ButtonGray } from "../../components/Button";
import { Trans } from "@lingui/macro";
import { TransactionResponse } from "@ethersproject/abstract-provider";
import { Separator } from "components/SearchModal/styleds";

export default function ChatSend(props: any) {
  const [inputMessage, setInputMessage] = useState<string>("");

  const { chatContract, account, chatRoomAddress } = props;
  const onClickSend = useCallback(async () => {
    if (account && chatContract && chatRoomAddress && inputMessage != '') {
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
          placeholder=" input your message"
          onChange={(event) => {
            setInputMessage(event.target.value)
          }}
          style={{ height: "100px", width: "100%", border: "1px solid rgb(237, 238, 242)", animation: "0.6s linear 0s 1 normal none running none", borderRadius: "16px" }}
        ></textarea>
      </AutoRow>
      <Separator />
      <AutoRow style={{ width: "60px", paddingTop: '3px' }}>
        <ButtonSecondary onClick={onClickSend}>
          <Trans>Send</Trans>
        </ButtonSecondary>
      </AutoRow>
    </>
  );
}
