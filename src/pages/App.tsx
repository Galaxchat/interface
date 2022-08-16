import Loader from 'components/Loader'
import { Suspense } from 'react'
import { useEffect } from 'react'
import { Route, Switch, useHistory, useLocation } from 'react-router-dom'
import styled from 'styled-components/macro'
import { useAnalyticsReporter } from '../components/analytics'
import ErrorBoundary from '../components/ErrorBoundary'
import Header from '../components/Header'
import Popups from '../components/Popups'
import Chat from './Chat'

const AppWrapper = styled.div`
  display: flex;
  flex-flow: column;
  align-items: flex-start;
`

const BodyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 120px 16px 0px 16px;
  align-items: center;
  flex: 1;
  z-index: 1;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding: 4rem 8px 16px 8px;
  `};
`

const HeaderWrapper = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  width: 100%;
  justify-content: space-between;
  position: fixed;
  top: 0;
  z-index: 2;
`

const Marginer = styled.div`
  margin-top: 5rem;
`

export default function App() {
  const history = useHistory()
  useAnalyticsReporter(useLocation())

  useEffect(() => {
    const unlisten = history.listen(() => {
      window.scrollTo(0, 0)
    })
    return () => {
      unlisten()
    }
  }, [history])

  return (
    <ErrorBoundary>
      <AppWrapper>
        <HeaderWrapper>
          <Header />
        </HeaderWrapper>
        <BodyWrapper>
          <Popups />
          <Suspense fallback={<Loader />}>
            <Switch>
              <Route exact strict path="/" component={Chat} />
            </Switch>
          </Suspense>
          <Marginer />
        </BodyWrapper>
      </AppWrapper>
    </ErrorBoundary>
  )
}
