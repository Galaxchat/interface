import { useMemo, useRef, useLayoutEffect } from "react";
import useENSAvatar from 'hooks/useENSAvatar'
import useENSName from 'hooks/useENSName'
import jazzicon from '@metamask/jazzicon'


export default function ChatUserInfo(props: any) {
  console.log("ChatUserInfo props ", props)
  const { address, type } = props
  const { avatar } = useENSAvatar(address ?? undefined)
  const ENSName = useENSName(address).ENSName
  const icon = useMemo(() => address && jazzicon(32, parseInt(address.slice(2, 10), 16)), [address])
  const iconRef = useRef<HTMLDivElement>(null)

  // console.log(address, ENSName, avatar)
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
        {avatar ? (
          <img className="rounded-circle me-2" width="25" src={avatar} alt="Address" />
        ) : (
          <span ref={iconRef} />
        )}
      </>
    )
  } else if (type === 'name') {
    return (
      <>
        {ENSName ? (
          <a className="link-muted" href="#" target="_blank">{ENSName}</a>
        ) : (
          <a className="link-muted" href="#" target="_blank">{address.substr(0, 6)}...{address.substr(-4)} </a>
        )}
      </>
    )
  } else {
    return (<></>)
  }
}
