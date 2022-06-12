import {
  Button,
  lightTheme,
  Provider,
  StatusLight,
  Text,
} from '@adobe/react-spectrum'
import { css } from '@emotion/react'
import { GlobalApp } from '../global/app'
import { useGlobal } from '../utils/use-global'
import logo from './logo.png'

export const Sidebar = () => {
  const app = useGlobal(GlobalApp)
  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        align-self: center;
        min-width: 250px;
      `}
    >
      <img
        src={logo}
        draggable={false}
        css={css`
          align-self: center;
        `}
      />
      <div className="row">
        <div className="col">
          <div>Status</div>
        </div>
        <div className="sep"></div>
        <div className="col">
          <StatusLight variant="positive" margin={0}>
            Ready
          </StatusLight>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <div>Port</div>
        </div>
        <div className="sep"></div>
        <div className="col">
          <input
            type="number"
            onMouseDown={(e) => {
              e.stopPropagation()
            }}
            value={app.port}
            onChange={() => {}}
            className="port"
          />
        </div>
      </div>
    </div>
  )
}
