import {StatusSlice} from '../model/StatusSlice'
import {WorkerActivityUpdateEvent} from '../model/WorkerActivityUpdateEvent'
import * as _ from 'lodash'
import {Worker} from '../model/Worker'

export const workerActivityUpdateEventToStatusSlice = (events: WorkerActivityUpdateEvent[], selectedAgents: Worker[]): StatusSlice[] =>
  _.flatten(selectedAgents.map(agent => {
    console.log('agent', agent)
    console.log('events', events)
      let agentEvents = events.filter(it => it.eventData.worker_sid === agent.sid)
      return convertEventsForAgent(agentEvents, agent)
    }),
  )

const convertEventsForAgent = (events: WorkerActivityUpdateEvent[], agent: Worker): StatusSlice[] => {
  if (events.length == 0) return [
    new StatusSlice(
      agent.friendlyName,
      'No data',
      new Date(0),
      new Date(),
    ),
  ]

  let slices = events.sort((a, b) => a.eventDateMs - b.eventDateMs)
    .map(event => new StatusSlice(
      event.eventData.worker_name,
      event.eventData.worker_previous_activity_name,
      new Date(event.eventDateMs - parseInt(event.eventData.worker_time_in_previous_activity_ms)),
      new Date(event.eventDateMs),
    ))

  let lastEvent = _.last<WorkerActivityUpdateEvent>(events)!!
  let lastSlice = new StatusSlice(
    lastEvent.eventData.worker_name,
    lastEvent.eventData.worker_activity_name,
    new Date(lastEvent.eventDateMs),
    new Date(),
  )

  console.log([...slices, lastSlice])

  return [...slices, lastSlice]
}
