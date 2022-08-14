import { useMemo, useRef, useLayoutEffect, } from "react";
import jazzicon from '@metamask/jazzicon'
import { useDefaultENS } from '../../hooks/useGalaxChat'
import { ExplorerDataType, getExplorerLink } from '../../utils/getExplorerLink'
import useActiveWeb3React from "hooks/useActiveWeb3React";

export default function ChatUserInfo(props: any) {
  const { address, type, style } = props
  const { ensName, ensAvatar } = useDefaultENS(address)
  const icon = useMemo(() => address && jazzicon(32, parseInt(address.slice(2, 10), 16)), [address])
  const iconRef = useRef<HTMLDivElement>(null)

  const { chainId } = useActiveWeb3React()
  const adressHref = chainId ? getExplorerLink(chainId, address, ExplorerDataType.ADDRESS) : undefined
  useLayoutEffect(() => {
    const current = iconRef.current
    if (icon) {
      current?.appendChild(icon)
      return () => {
        try {
          current?.removeChild(icon)
        } catch (e) {
          console.error('Avatar icon not found')
        }
      }
    }
    return
  }, [icon, iconRef])

  if (type === 'avatar') {
    return (
      <>
        {ensAvatar ? (
          <img className="rounded-circle me-2" width="25" src={ensAvatar} alt="Address" />
        ) : (
          <span ref={iconRef} style={style} />
        )}
      </>
    )
  } else if (type === 'name') {
    return (
      <>
        {ensName ? (
          <a className="link-muted" href={adressHref} target="_blank">{ensName} </a>
        ) : (
          <a className="link-muted" href={adressHref}target="_blank">{address.substr(0, 6)}...{address.substr(-4)} </a>
        )}
      </>
    )
  } else {
    return (<></>)
  }
}
