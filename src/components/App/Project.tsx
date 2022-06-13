import { Button, Icon, StatusLight, Text } from '@adobe/react-spectrum'
import { AnimatePresence, motion } from 'framer-motion'
import { AppStatus, GlobalApp } from '../../global/global-app'
import { useGlobal } from '../../utils/use-global'
import { useLocal } from '../../utils/use-local'

import DeleteOutline from '@spectrum-icons/workflow/DeleteOutline'
import Edit from '@spectrum-icons/workflow/Edit'
import Globe from '@spectrum-icons/workflow/GlobeOutline'
import { changePort } from '../../actions/change-port'
import { delProject } from '../../actions/del-project'
import logo from '../logo.png'

const statusColor = (status: AppStatus) => {
  const ref: Record<AppStatus, string> = {
    Initializing: 'notice',
    Ready: 'positive',
    'Port in use': 'negative',
    'Finding port': 'notice',
    Restarting: 'purple',
  }

  return ref[status]
}

export const Project = () => {
  const app = useGlobal(GlobalApp)
  const local = useLocal({
    copy: false,
    port: app.port.toString(),
  })
  const proj = app.project
  if (!proj) return null

  return (
    <div
      className="flex flex-row i-center"
      css={css`
        min-height: 200px;
        padding: 10px;
        border-bottom: 1px dashed #ececeb;
      `}
    >
      <img
        draggable={false}
        src={logo}
        css={css`
          padding: 10px;
        `}
      />
      <div
        className="flex flex-col flex-1 self-stretch"
        css={css`
          padding: 25px 0px 0px 0px;
        `}
      >
        <div
          css={css`
            display: inline-block;
            width: 80%;
            text-transform: capitalize;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-size: 1.3rem;
          `}
        >
          {proj.name}
        </div>
        <a
          draggable={false}
          css={css`
            color: #999;
            cursor: pointer;
            padding-right: 50px;

            > * {
              pointer-events: none;
            }
            &:hover {
              span > div {
                text-decoration: underline;
              }
            }

            .right-copy {
              display: none;
            }

            &:hover {
              .right-copy {
                display: block;
              }
            }
          `}
          onContextMenu={() => {
            tauri.clipboard.writeText(proj.path)
            local.copy = true
            local.render()
            setTimeout(() => {
              local.copy = false
              local.render()
            }, 3000)
          }}
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            tauri.shell.open(app.path)
          }}
        >
          <span
            css={css`
              display: flex;
              width: 100%;
              height: 23px;
            `}
          >
            <div
              css={css`
                position: absolute;
                width: calc(100vw - 250px);

                text-transform: capitalize;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              `}
            >
              {proj.path}
            </div>
          </span>
          <AnimatePresence>
            {local.copy ? (
              <motion.div
                exit={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                css={css`
                  position: absolute;
                  font-size: 12px;
                  opacity: 1;
                `}
              >
                Copied
              </motion.div>
            ) : (
              <div
                className="right-copy"
                css={css`
                  position: absolute;
                  font-size: 12px;
                  opacity: 1;
                `}
              >
                Right click to copy path
              </div>
            )}
          </AnimatePresence>
        </a>

        <div className="flex flex-1 flex-col" css={css``}>
          <div className="flex self-start flex-1 flex-col j-center">
            <Button
              variant="primary"
              isDisabled={app.status !== 'Ready'}
              onPress={() => {
                tauri.shell.open(
                  `http://localhost:${app.port}`
                )
              }}
            >
              <Icon>
                <Globe />
              </Icon>
              <Text>
                <div className="flex flex-row i-center">
                  Open{' '}
                  <span
                    css={css`
                      display: inline-block;
                      text-transform: capitalize;
                      overflow: hidden;
                      text-overflow: ellipsis;
                      white-space: nowrap;
                      max-width: 100px;
                      margin: 0px 3px;
                    `}
                  >
                    {app.project?.name}
                  </span>{' '}
                  in Browser
                </div>
              </Text>
            </Button>
          </div>
          <div
            className="flex flex-row items-center self-stretch"
            css={css`
              justify-content: space-between;
              margin: 5px 0px 0px -1px;
              padding: 1px 7px;
              border-radius: 3px;
              color: #999999;
            `}
          >
            <div className="flex items-center">
              <div
                css={css`
                  > div {
                    display: flex;
                    align-items: center;
                    margin: 0px;
                    padding: 2px 0px 0px 0px;
                    min-height: 20px;
                    min-width: 10px;

                    &::before {
                      margin: 0px;
                    }
                  }
                `}
              >
                <StatusLight
                  variant={statusColor(app.status) as any}
                  margin={0}
                />
              </div>
              <div
                css={css`
                  padding-left: 5px;
                `}
              >
                {app.status}{' '}
                {(app.status === 'Ready' || app.status === 'Port in use') && (
                  <>
                    {app.status === 'Ready' ? 'on' : ' → '} http://localhost:{' '}
                    <span>
                      <input
                        type="text"
                        css={css`
                          height: 15px;
                          font-size: 12px;
                          width: 40px;
                        `}
                        value={local.port}
                        onChange={(e) => {
                          const val = e.target.value
                          local.port = val
                          local.render()
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.currentTarget.blur()
                          }
                        }}
                        onBlur={async () => {
                          await changePort(Number(local.port), app)
                        }}
                      />

                      <span
                        css={css`
                          svg {
                            height: 13px;
                          }
                        `}
                      >
                        <Edit />
                      </span>
                    </span>
                  </>
                )}
              </div>
            </div>
            <button
              className="flex flex-row i-center"
              css={css`
                color: #f39494;
                background: white;
                border: 0px;
                cursor: pointer;

                &:hover {
                  color: red;
                }

                > * {
                  pointer-events: none;
                }
                svg {
                  margin: 0px 5px 0px 0px;
                  width: 15px;
                }
              `}
              onClick={async () => {
                if (app.project) {
                  await delProject(app, app.project)
                }
              }}
            >
              <DeleteOutline />
              <div
                css={css`
                  display: inline-block;
                  text-transform: capitalize;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                  max-width: 100px;
                `}
              >
                Remove {app.project?.name}
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
