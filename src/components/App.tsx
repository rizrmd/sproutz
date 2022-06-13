import { lightTheme, Provider } from '@adobe/react-spectrum'
import { css } from '@emotion/react'
import { useEffect } from 'react'
import { GlobalContext } from '../utils/use-global'
import { useLocal } from '../utils/use-local'
import { AppRoot } from './App/Root'

function App() {
  const local = useLocal({
    global: new WeakMap(),
  })

  useEffect(() => {
    const appLoading = document.getElementById('app-loading')
    if (appLoading) appLoading.style.display = 'none'

    const root = document.getElementById('root')
    if (root) root.style.display = 'flex'
  }, [])

  return (
    <Provider theme={lightTheme}>
      <GlobalContext.Provider
        value={{
          global: local.global,
          render: () => {
            local.render()
          },
        }}
      >
        <div
          onClick={(e) => {
            e.preventDefault()
          }}
          onContextMenu={(e) => {
            e.preventDefault()
            e.stopPropagation()
          }}
          css={css`
            width: 100vw;
            height: 100vh;
            display: flex;
            flex-direction: row;
            align-items: stretch;
            justify-content: center;

            div {
              cursor: default;
              user-select: none;
            }

            button {
              cursor: pointer;
            }

            .flex {
              display: flex;
            }
            .flex-1 {
              flex: 1;
            }
            .flex-col {
              flex-direction: column;
            }
            .flex-row {
              flex-direction: row;
            }
            .center {
              align-items: center;
              justify-content: center;
            }
            .i-center {
              align-items: center;
            }
            .i-stretch {
              align-items: stretch;
            }
            .j-center {
              justify-content: center;
            }
            .self-stretch {
              align-self: stretch;
            }
            .self-center {
              align-self: center;
            }
            .self-start {
              align-self: flex-start;
            }
            .transition-all {
              transition-property: all;
              transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
              transition-duration: 150ms;
            }
          `}
        >
          <AppRoot />
        </div>
      </GlobalContext.Provider>
    </Provider>
  )
}

export default App
