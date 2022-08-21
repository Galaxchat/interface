import {
  useState,
  useCallback
} from "react";
import { AutoRow } from "components/Row";
import { ButtonSecondary } from "../../components/Button";
import { Trans } from "@lingui/macro";
import { TransactionResponse } from "@ethersproject/abstract-provider";
import { Separator } from "components/SearchModal/styleds";
import { AutoColumn } from "components/Column";
import ChatUserInfo from "components/chat/ChatUserInfo";
import Loader from "components/Loader";
import { Editor, EditorState } from "draft-js";
import 'draft-js/dist/Draft.css';
import ChatModalType from "./ChatModalType";


export default function ChatSend(props: any) {
  const [loading, setLoading] = useState<boolean>(false);
  const [modalType, setModalType] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [editorState, setEditorState] = useState(
    () => EditorState.createEmpty(),
  );
  const { chatContract, account, chatRoomAddress } = props;


  const onClickSend = useCallback(async () => {
    const input = editorState.getCurrentContent().getPlainText("\n");
    if (account && chatContract && chatRoomAddress && input !== "") {
      setLoading(true);
      chatContract
        ?.send(chatRoomAddress, account, input, {})
        .then((tx: TransactionResponse) => {
          setEditorState(() => EditorState.createEmpty())
          setLoading(false);
        })
        .catch((e: Error) => {
          setLoading(false);
          console.log(e);
        });
    } else if (!account) {
      setModalType("notConnect")
      setIsOpen(true);
    } else if (!chatRoomAddress) {
      setModalType("notSearch")
      setIsOpen(true);
    }else if (input === "") {
      setModalType("notContent")
      setIsOpen(true);
    }
  }, [editorState, account, chatContract, chatRoomAddress]);

  return (
    <>
      <AutoRow style={{ position: "relative" }}>
        <AutoColumn justify="flex-start" style={{ position: "absolute", height: "100%" }}>
          <ChatUserInfo
            address={account}
            type="avatar"
            style={{ marginRight: "16px", marginLeft: "16px" }}
          />
        </AutoColumn>

        <AutoColumn style={{ marginLeft: "60px", width: "100%", minHeight: "60px" }}>
          <Editor editorState={editorState} onChange={setEditorState} placeholder='something new' />
        </AutoColumn>
      </AutoRow>
      <Separator />
      <br />
      <AutoRow style={{ width: "60px", paddingTop: "3px" }}>
        {loading ? (
          <>
            <ButtonSecondary style={{ pointerEvents: "none" }}>
              <Loader />
            </ButtonSecondary>
          </>
        ) : (
          <ButtonSecondary onClick={onClickSend}>
            <Trans>Send</Trans>
          </ButtonSecondary>
        )}
      </AutoRow>
      {modalType ?
        <ChatModalType
          showModal={(open:boolean) =>{ setIsOpen(open)}}
          type={modalType}
          isOpen={isOpen}
        />
        : null
      }
    </>
  );
}
