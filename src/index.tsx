import '@reach/dialog/styles.css'
import 'inter-ui'
import 'polyfills'
import 'components/analytics'

import { BlockNumberProvider } from 'lib/hooks/useBlockNumber'
import { StrictMode } from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { HashRouter } from 'react-router-dom'
import Web3Provider from './components/Web3Provider'
import { LanguageProvider } from './i18n'
import App from './pages/App'
import * as serviceWorkerRegistration from './serviceWorkerRegistration'
import store from './state'
import ThemeProvider, { ThemedGlobalStyle } from './theme'

if (!!window.ethereum) {
  window.ethereum.autoRefreshOnNetworkChange = false
}


ReactDOM.render(
  <StrictMode>
    <Provider store={store}>
      <HashRouter>
        <LanguageProvider>
          <Web3Provider>
              <BlockNumberProvider>
                <ThemeProvider>
                  <ThemedGlobalStyle />
                  <App />
                </ThemeProvider>
              </BlockNumberProvider>
          </Web3Provider>
        </LanguageProvider>
      </HashRouter>
    </Provider>
  </StrictMode>,
  document.getElementById('root')
)

if (process.env.REACT_APP_SERVICE_WORKER !== 'false') {
  serviceWorkerRegistration.register()
}
