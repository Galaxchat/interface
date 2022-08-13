import {
  useState,
  useCallback,
  useRef,
  RefObject
} from "react";
import { AutoRow } from "components/Row";
import { ButtonSecondary } from "../../components/Button";
import { Trans } from "@lingui/macro";
import { TransactionResponse } from "@ethersproject/abstract-provider";
import { Separator } from "components/SearchModal/styleds";
import { AutoColumn } from "components/Column";
import ChatUserInfo from "components/chat/ChatUserInfo";
import Loader from "components/Loader";


export default function ChatSend(props: any) {
  const [inputMessage, setInputMessage] = useState<string>("");
  const [inputSize, setInputSize] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const chatInputRef = useRef<HTMLInputElement>();
  const { chatContract, account, chatRoomAddress } = props;

  const onClickSend = useCallback(async () => {
    const input = chatInputRef.current?.innerText;
    if (input) {
      setInputMessage(input);
    }
    if (account && chatContract && chatRoomAddress && input != "") {
      setLoading(true);
      chatContract
        ?.send(chatRoomAddress, account, input, {})
        .then((tx: TransactionResponse) => {
          setInputMessage("");
          setLoading(false);
        })
        .catch((e: Error) => {
          setLoading(false);
          console.log(e);
        });
    }
  }, [inputMessage, account, chatContract, chatRoomAddress]);

  return (
    <>
      <AutoRow id="chat-input-box">
        {/* <textarea
          name="message"
          id="messageInput"
          value={inputMessage}
          placeholder=" input your message"
          onChange={(event) => {
            setInputMessage(event.target.value)
          }}
          style={{ height: "100px", width: "100%", border: "1px solid rgb(237, 238, 242)", animation: "0.6s linear 0s 1 normal none running none", borderRadius: "16px" }}
        ></textarea> */}
        <AutoColumn justify="flex-start">
          <ChatUserInfo
            address={account}
            type="avatar"
            style={{ marginRight: "16px" }}
          />
        </AutoColumn>
        <AutoColumn>
          <div
            dir="auto"
            suppressContentEditableWarning
            contentEditable
            className="css-901oao r-18jsvk2 r-6koalj r-37j5jr r-adyw6z r-16dba41 r-135wba7 r-bcqeeo r-qvutc0"
            ref={chatInputRef as RefObject<HTMLInputElement>}
          >
            <div className="css-1dbjc4n r-xoduu5 r-xyw6el r-mk0yit r-13qz1uu">
              <div className=" draftjs-styles_0">
                <div
                  className="r-1niwhzg r-17gur6a r-1yadl64 r-deolkf r-homxoj r-poiln3 r-7cikom r-1ceczpf r-1ny4l3l r-t60dpp r-1ttztb7"
                  data-testid="tweetTextarea_0RichTextInputContainer"
                  style={{ maxHeight: "720px" }}
                >
                  <div className="DraftEditor-root">
                    <div className="public-DraftEditorPlaceholder-root">
                      <div
                        className="public-DraftEditorPlaceholder-inner input"
                        id="placeholder-fl9nl"
                        style={{ whiteSpace: "pre-wrap" }}
                        placeholder="Something New?"
                      ></div>
                    </div>
                    <div className="DraftEditor-editorContainer">
                      <div
                        suppressContentEditableWarning
                        aria-activedescendant="typeaheadFocus-0.5171288786156185"
                        aria-autocomplete="list"
                        aria-controls="typeaheadDropdownWrapped-11"
                        aria-describedby="placeholder-fl9nl"
                        aria-label="chat-input-message"
                        aria-multiline="true"
                        className="notranslate public-DraftEditor-content"
                        contentEditable="true"
                        data-testid="tweetTextarea_0"
                        role="textbox"
                        spellCheck="true"
                        tabIndex={0}
                        no-focustrapview-refocus="true"
                        style={{
                          outline: "none",
                          userSelect: "text",
                          whiteSpace: "pre-wrap",
                          overflowWrap: "break-word",
                        }}
                      >
                        <div data-contents="true">
                          <div
                            className=""
                            data-block="true"
                            data-editor="fl9nl"
                            data-offset-key="e8m0t-0-0"
                          >
                            <div
                              data-offset-key="e8m0t-0-0"
                              className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"
                            >
                              <span data-offset-key="e8m0t-0-0">
                                <br data-text="true" />
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AutoColumn>
        {/* <AutoColumn>
          <div className="input" contentEditable placeholder="Something New?"></div>
          <br />
        </AutoColumn> */}
      </AutoRow>
      <Separator />
      <br />
      <AutoRow style={{ width: "60px", paddingTop: "3px" }}>
        {loading ? (
          <>
            <ButtonSecondary style={{pointerEvents: "none"}}>
              {/* <Trans>Sending</Trans> */}
              <Loader />
            </ButtonSecondary>
          </>
        ) : (
          <ButtonSecondary onClick={onClickSend}>
            <Trans>Send</Trans>
          </ButtonSecondary>
        )}
      </AutoRow>
    </>
  );
}
