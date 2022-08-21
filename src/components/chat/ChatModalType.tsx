
import ChatModal from "./ChatModal";
import { AutoRow } from "components/Row";

export default function ChatModalType(props: any) {
  const { type, showModal, isOpen, info } = props
  return (
    <>
      {type === "notConnect" ?
        <ChatModal
          title="Error"
          showModal={showModal}
          onClickOk={showModal}
          isOpen={isOpen}
          InfoHtml={
            <AutoRow justify="center">
              <span style={{ fontSize: "18px", fontWeight: 500 }}> Please connect wallet</span>
            </AutoRow>
          }
        />
        : null
      }
      {type === "notSearch" ?
        <ChatModal
          title="Error"
          showModal={showModal}
          onClickOk={showModal}
          isOpen={isOpen}
          InfoHtml={
            <AutoRow justify="center">
              <span style={{ fontSize: "18px", fontWeight: 500 }}> Please search a address</span>
            </AutoRow>
          }
        />
        : null
      }
      {type === "noFullProgress" ?
        <ChatModal
          title="Error"
          showModal={showModal}
          onClickOk={showModal}
          isOpen={isOpen}
          InfoHtml={
            <AutoRow justify="center">
              <span style={{ fontSize: "18px", fontWeight: 500 }}> Progress is not enough</span>
            </AutoRow>
          }
        />
        : null
      }
      {type === "tokenCreated" ?
        <ChatModal
          title="Error"
          showModal={showModal}
          onClickOk={showModal}
          isOpen={isOpen}
          InfoHtml={
            <AutoRow justify="center">
              <span style={{ fontSize: "18px", fontWeight: 500 }}> Token has been created </span>
            </AutoRow>
          }
        />
        : null
      }
      {type === "notContent" ?
        <ChatModal
          title="Error"
          showModal={showModal}
          onClickOk={showModal}
          isOpen={isOpen}
          InfoHtml={
            <AutoRow justify="center">
              <span style={{ fontSize: "18px", fontWeight: 500 }}> Your message is empty </span>
            </AutoRow>
          }
        />
        : null
      }
      {type === "transactionError" ?
        <ChatModal
          title="TransactionError"
          showModal={showModal}
          onClickOk={showModal}
          isOpen={isOpen}
          InfoHtml={
            <AutoRow justify="flex-start">
              <span style={{ fontSize: "18px", fontWeight: 500, overflow: "auto" }}> {info}</span>
            </AutoRow>
          }
        />
        : null
      }
    </>
  )
}