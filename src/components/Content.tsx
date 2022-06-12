import { css } from '@emotion/react'

export const Content = () => {
  return (
    <div
      css={css`
        flex: 1;
        display: flex;
        flex-direction: row;
        align-items: stretch;

        .sep {
          border-left: 1px dashed #ececeb;
          height: 90%;
          align-self: center;
        }
        .content {
          flex: 1;
        }
      `}
    >
      <div className="sep"></div>
      <div className="content"></div>
    </div>
  )
}
