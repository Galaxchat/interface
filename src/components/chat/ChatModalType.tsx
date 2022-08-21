
import ChatModal from "./ChatModal";
import { AutoRow } from "components/Row";

export default function ChatModalType(props: any) {
  const { type, showModal, isOpen, info } = props
  console.log()
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
        : type === "notSearch" ?
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
          : <ChatModal
            title="Error"
            showModal={showModal}
            onClickOk={showModal}
            isOpen={isOpen}
            InfoHtml={
              <AutoRow justify="center">
                <span style={{ fontSize: "18px", fontWeight: 500 }}> {info}</span>
              </AutoRow>
            }
          />
      }
    </>
  )
}