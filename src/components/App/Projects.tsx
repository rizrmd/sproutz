import { css } from '@emotion/react'
import Add from '@spectrum-icons/workflow/Add'
import { Fragment } from 'react'
import { changeProject } from '../../actions/change-project'
import { newProject } from '../../actions/new-project'
import { GlobalApp } from '../../global/global-app'
import { useGlobal } from '../../utils/use-global'
import * as Icons from './IconProject'

export const Projects = () => {
  const app = useGlobal(GlobalApp)

  return (
    <div
      className="flex flex-1"
      css={css`
        position: relative;
      `}
    >
      <div
        css={css`
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          align-content: flex-start;

          overflow: auto;
          position: absolute;
          left: 0px;
          right: 0px;
          bottom: 0px;
          top: 0px;

          padding: 20px;
          button {
            background: white;
            align-items: stretch;
            justify-content: flex-start;
            display: flex;
            flex-direction: column;
            width: 170px;
            height: 170px;
            border: 2px solid #f9f9f5;
            border-radius: 10px;
            margin: 10px;
            cursor: pointer;

            .icon {
              width: 150px;
              opacity: 0.7;
              flex: 1;
              align-items: center;
              justify-content: center;
              svg {
                padding-top: 20px;
                height: 80px;
              }
            }

            .text {
              text-transform: capitalize;
              font-size: 0.9rem;
              line-height: 1.2rem;
              font-weight: 500;
              padding: 0px 0px;
              margin-bottom: 3px;
              height: 38px;
              text-align: center;
              display: inline-block;
              text-transform: capitalize;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: pre-wrap;
              word-wrap: break-word;
            }

            > * {
              pointer-events: none;
            }
            &:hover {
              background: #ecf7ed;
              border: 2px solid #cae4d1;
            }
            &.active {
              border: 2px solid green;
              background: #edfdf3;
            }
          }
        `}
      >
        {app.projects.map((e) => {
          const Icon = (Icons as any)[e.icon || 'Monsterra']

          return (
            <Fragment key={e.path}>
              <button
                onClick={() => {
                  changeProject(app, e)
                }}
                className={
                  app.project && e.path === app.project.path ? 'active' : ''
                }
              >
                <div className="flex  icon">
                  <Icon />
                </div>
                <div className="flex center text">{e.name}</div>
              </button>
            </Fragment>
          )
        })}
        <button
          onClick={async () => {
            const dir = await tauri.dialog.open({
              directory: true,
              title: 'Choose folder of the new project',
            })

            if (typeof dir === 'string') {
              await newProject(app, dir)
            }
          }}
        >
          <div className="flex  icon">
            <Add size="L" />
          </div>
          <div
            className="flex text center"
            css={css`
              text-transform: capitalize;
              font-size: 1rem;
              font-weight: 500;
            `}
          >
            New Project
          </div>
        </button>
      </div>
    </div>
  )
}
