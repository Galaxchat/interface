import { useCallback, useState, RefObject, useRef, useEffect } from "react";
import { ButtonSecondary } from "../../components/Button";
import { AutoColumn } from "../../components/Column";
import { AutoRow } from "components/Row";
import { SearchInput } from "../../components/chat/styleds";
import { t, Trans } from "@lingui/macro";
import { isAddress } from "../../utils";
import { useChatRoomInfo } from "hooks/useGalaxChat";

export default function ChatSearch(props: any) {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [enterSearch, setEnterSearch] = useState<string>("");

  const { changeRoomInfo } = props;
  const  chatRoomInfo = useChatRoomInfo(enterSearch)

  const inputRef = useRef<HTMLInputElement>();

  const handleInput = useCallback((event) => {
    const input = event.target.value;
    setSearchQuery(input);
  }, []);

  const onClickSearch = useCallback(async () => {
    const searchQueryTemp = searchQuery;
    setSearchQuery("");
    const isAddressSearch = isAddress(searchQueryTemp);
    if (isAddressSearch) {
      setEnterSearch(isAddressSearch)
    } else {
      console.log(`${searchQueryTemp} is not a address`);
    }
  }, [searchQuery, enterSearch]);

  useEffect(()=>{
    changeRoomInfo(chatRoomInfo)
  },[enterSearch, chatRoomInfo])

  return (
    <>
      <AutoRow justify="center">
        <AutoColumn gap={"sm"}>
          <SearchInput
            type="text"
            id="address-search-input"
            placeholder={t`Search name or paste address`}
            autoComplete="off"
            value={searchQuery}
            ref={inputRef as RefObject<HTMLInputElement>}
            onChange={handleInput}
            style={{ padding:"10px" }}
          />
        </AutoColumn>
        <AutoColumn>
          <ButtonSecondary onClick={onClickSearch} style={{ marginLeft: "10px" }}>
            <Trans>Search</Trans>
          </ButtonSecondary>
        </AutoColumn>
      </AutoRow>
    </>
  );
}
