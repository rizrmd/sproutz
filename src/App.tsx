import { lightTheme, Provider } from '@adobe/react-spectrum'
import { css } from '@emotion/react'
import { useEffect } from 'react'
import { Content } from './components/Content'
import { Sidebar } from './components/Sidebar'
import { GlobalContext } from './utils/use-global'
import { useLocal } from './utils/use-local'

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
          onMouseDown={(e) => {
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

            * {
              cursor: default;
            }

            .port {
              position: absolute;
              display: block;
              max-width: 60px;
              left: 10px;
              border: 1px solid #ececeb;
              padding: 2px 0px 2px 10px;
              margin: 0px;
              font-size: 13px;
              cursor: text;
              background: white;
              box-shadow: 0px;
            }

            .row {
              display: flex;
              flex-direction: row;
              align-items: center;

              margin-top: 6px;

              .sep {
                border-left: 1px solid #ececeb;
                min-height: 26px;
                margin: 1px 0px -1px 0px;
              }
              .col {
                position: relative;
                display: flex;
                flex: 1;
                align-items: center;
                padding-right: 30px;

                &:first-of-type {
                  justify-content: flex-end;
                }

                &:last-of-type {
                  justify-content: flex-start;
                }

                > div {
                  display: flex;
                  align-items: center;
                  margin: 0px;
                  padding: 0px;
                  min-height: 20px;
                }
              }
            }

            .open {
              margin-top: 15px;

              display: flex;
              justify-content: center;

              button {
                cursor: pointer;
              }

              .text {
                margin-left: 4px;
              }
            }
          `}
        >
          <Sidebar />
          <Content />
        </div>
      </GlobalContext.Provider>
    </Provider>
  )
}

export default App
