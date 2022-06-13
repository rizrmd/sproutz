import { Button } from '@adobe/react-spectrum'
import { AnimatePresence, motion } from 'framer-motion'
import { findPort } from '../../actions/find-port'
import { initApp } from '../../actions/init-app'
import { newProject } from '../../actions/new-project'
import { GlobalApp } from '../../global/global-app'
import { useGlobal } from '../../utils/use-global'
import { Project } from './Project'

import logo from '../logo.png'
import { Projects } from './Projects'

export const AppRoot = () => {
  const app = useGlobal(GlobalApp, async () => {
    initApp(app)

    // if (!app.id || app.id.length < 5) {
    //   await activateID(app)
    // } else {
    //   if (!(await verifyID(app))) {
    //     await activateID(app)
    //   }
    // }

    if (!app.port) {
      app.port = await findPort(app)
      app.render()
    }
  })

  return (
    <>
      <AnimatePresence>
        {!app.project ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-1 flex-col center"
            css={css``}
          >
            <img draggable={false} src={logo} />
            <div
              className="flex flex-col i-center"
              css={css`
                padding: 10px;
              `}
            >
              <Button
                variant="primary"
                onPress={async () => {
                  const dir = await tauri.dialog.open({
                    directory: true,
                    title: 'Choose folder of the new project',
                  })

                  if (typeof dir === 'string') {
                    await newProject(app, dir)
                  }
                }}
              >
                New Project
              </Button>
              <div
                css={css`
                  padding: 10px;
                  color: #999;
                `}
              >
                Choose folder to create project
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="flex flex-col flex-1">
            <Project />
            <Projects />
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
