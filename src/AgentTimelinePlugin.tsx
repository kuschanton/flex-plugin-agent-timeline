import React from 'react'
import * as Flex from '@twilio/flex-ui'
import {FlexPlugin} from '@twilio/flex-plugin'
import {Theme} from '@twilio-paste/core/theme'
import SideBarButton from './components/SideBarButton'
import {WorkersTimelinePanel} from './components/WorkersTimelinePanel'
import {View} from '@twilio/flex-ui'
import {Box} from '@twilio-paste/core/box'

const PLUGIN_NAME = 'AgentTimelinePlugin'

export default class AgentTimelinePlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME)
  }

  /**
   * This code is run when your plugin is being started
   * Use this to modify any UI components or attach to the actions framework
   *
   * @param flex { typeof Flex }
   */
  async init(flex: typeof Flex, manager: Flex.Manager): Promise<void> {
    flex.SideNav.Content.add(<SideBarButton key='access-overview-button'/>, {})

    flex.ViewCollection.Content.add(
      <View name='agent-timeline' key='agent-timeline'>
        <Theme.Provider theme='default'>
          <Box
            margin='space50'
            width='calc(100vw - 150px)'
          >
            <WorkersTimelinePanel key='AgentTimelinePage'/>
          </Box>
        </Theme.Provider>
      </View>,
    )

    registerAlerts(flex, manager)
  }
}

const registerAlerts = (flex: typeof Flex, manager: Flex.Manager) => {
  (manager.strings as any).agentTimelineError = 'Agent Timeline Plugin Error: {{msg}}'

  flex.Notifications.registerNotification({
    id: 'agentTimelineError',
    content: 'agentTimelineError',
    type: flex.NotificationType.error,
  })
}
