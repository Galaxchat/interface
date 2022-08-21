import { useCallback, useState, RefObject, useRef, useEffect } from "react";
import { ButtonSecondary } from "../../components/Button";
import { AutoColumn } from "../../components/Column";
import { AutoRow } from "components/Row";
import { SearchInput } from "../../components/chat/styleds";
import { t, Trans } from "@lingui/macro";
import { isAddress } from "../../utils";
import { useChatRoomInfo } from "hooks/useGalaxChat";
import ChatModalType from "./ChatModalType";

export default function ChatSearch(props: any) {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [enterSearch, setEnterSearch] = useState<string>("");
  const [modalType, setModalType] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { changeRoomInfo, account } = props;
  const chatRoomInfo = useChatRoomInfo(enterSearch)

  const inputRef = useRef<HTMLInputElement>();

  const handleInput = useCallback((event) => {
    const input = event.target.value;
    setSearchQuery(input);
  }, []);

  const onClickSearch = useCallback(async () => {
    const searchQueryTemp = searchQuery;
    setSearchQuery("");
    const isAddressSearch = isAddress(searchQueryTemp);
    if (isAddressSearch && account) {
      setEnterSearch(isAddressSearch)
    } else if (!account ) {
      setModalType("notConnect")
      setIsOpen(true);
    } else {
      console.log(`${searchQueryTemp} is not a address`);
      setModalType("notSearch");
      setIsOpen(true)
    }
  }, [searchQuery, enterSearch, account]);

  const showModal = (open: boolean) => {
    setIsOpen(open);
  };


  useEffect(() => {
    changeRoomInfo(chatRoomInfo)
  }, [enterSearch, chatRoomInfo])

  return (
    <>
      <AutoRow justify="center">
        <AutoColumn gap={"sm"}>
          <SearchInput
            type="text"
            id="address-search-input"
            placeholder={t`Search address`}
            autoComplete="off"
            value={searchQuery}
            ref={inputRef as RefObject<HTMLInputElement>}
            onChange={handleInput}
            style={{ padding: "10px" }}
          />
        </AutoColumn>
        <AutoColumn>
          <ButtonSecondary onClick={onClickSearch} style={{ marginLeft: "10px" }}>
            <Trans>Search</Trans>
          </ButtonSecondary>
        </AutoColumn>
      </AutoRow>
      {modalType ?
        <ChatModalType
          showModal={showModal}
          type={modalType}
          isOpen={isOpen}
        />
        : null
      }
    </>
  );
}
