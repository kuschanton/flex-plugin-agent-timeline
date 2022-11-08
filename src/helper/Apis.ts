import * as Flex from '@twilio/flex-ui'
import {Manager} from '@twilio/flex-ui'
import {Worker} from '../model/Worker'
import {WorkerActivityUpdateEvent} from '../model/WorkerActivityUpdateEvent'
import _ from 'lodash'

interface ListWorkers {
  workers: Worker[];
}

interface ListEvents {
  events: WorkerActivityUpdateEvent[]
}

export const apiListWorkers = async (): Promise<Worker[]> => {
  try {
    const {workers} = <ListWorkers>await request('/get-workers')
    return workers
  } catch (e: any) {
    console.log(e)
    Flex.Notifications.showNotification('agentTimelineError', {msg: `Error getting workers ${e.message}`})
    return []
  }
}

export const apiListEventsForWorkers = async (workerSids: string[], date: string): Promise<WorkerActivityUpdateEvent[]> => {
  try {
    let promises = workerSids.map(sid => request('/get-events', {workerSid: sid, date: date}))
    let eventResponses = <ListEvents[]>await Promise.all(promises)
    return _.flatten(eventResponses.map(response => response.events))
  } catch (e: any) {
    console.log(e)
    Flex.Notifications.showNotification('agentTimelineError', {msg: `Error getting events ${e.message}`})
    return []
  }
}


const request = async (path: string, params = {}) => {
  const manager = Manager.getInstance()
  const token = manager.store.getState().flex.session.ssoTokenPayload.token
  const {REACT_APP_SERVICE_BASE_URL} = process.env

  const url = `${REACT_APP_SERVICE_BASE_URL}${path}`

  const body = {
    ...params,
    token,
  }

  const options = {
    method: 'POST',
    body: new URLSearchParams(body),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
  }

  const respRaw = await fetch(url, options)
  const resp = await respRaw.json()

  if (resp.error) {
    throw new Error(resp.error)
  }

  return resp
}
