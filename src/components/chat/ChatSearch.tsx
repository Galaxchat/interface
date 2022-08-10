import {
  useCallback,
  useState,
  KeyboardEvent,
  RefObject,
  useRef
} from "react";
import { AutoColumn } from "../../components/Column";
import { SearchInput } from "../../components/chat/styleds";
import { t } from "@lingui/macro";
import { isAddress } from '../../utils'

export default function ChatSearch(props: any) {
  const [searchQuery, setSearchQuery] = useState<string>("");
  // const [enterQuery, setEnterQuery] = useState<string>("");

  const { changeEnterQuery} = props
  const inputRef = useRef<HTMLInputElement>();

  const handleInput = useCallback((event) => {
    const input = event.target.value;
    setSearchQuery(input);
  }, []);

  
  const handleEnter = useCallback(async (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const searchQueryTemp = searchQuery
      setSearchQuery('')
      const isAddressSearch = isAddress(searchQueryTemp)
      if (isAddressSearch){
        changeEnterQuery(searchQueryTemp)
      } else {
        console.log(`${searchQueryTemp} is not a address`)
      }
    }
  }, [searchQuery, changeEnterQuery]);

  return (
    <>
      <AutoColumn gap={"lg"}>
        <SearchInput
          type="text"
          id="address-search-input"
          placeholder={t`Search name or paste address`}
          autoComplete="off"
          value={searchQuery}
          ref={inputRef as RefObject<HTMLInputElement>}
          onChange={handleInput}
          onKeyDown={handleEnter}
        />
      </AutoColumn>
    </>
  )
}

