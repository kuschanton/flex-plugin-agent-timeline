import {Box} from '@twilio-paste/core/box'
import React, {useState} from 'react'
import {workerActivityUpdateEventToStatusSlice} from '../mappers/WorkerActivityUpdateEventToStatusSlice'
import {TimeRangePicker} from './TimeRangePicker'
import {StatusSlice} from '../model/StatusSlice'
import {Worker} from '../model/Worker'
import {WorkersMultiSelect} from './WorkersMultiSelect'
import {WorkersTimeline} from './WorkersTimeline'
import {apiListEventsForWorkers, apiListWorkers} from '../helper/Apis'
import {WorkerActivityUpdateEvent} from '../model/WorkerActivityUpdateEvent'
import {Flex, Spinner} from '@twilio-paste/core'
import _ from 'lodash'
import {DatePickerComponent} from './DatePickerComponent'
import {DateTime} from 'luxon'

const WORKERS_LIMIT = 10

export const WorkersTimelinePanel = () => {

  const [fetchingWorkers, setFetchingWorkers] = useState(true)
  const [workers, setWorkers] = useState<Worker[]>([])
  const [selectedWorkers, setSelectedWorkers] = useState<Worker[]>([])

  const [date, setDate] = useState(DateTime.now().toISODate())
  const dateMin = DateTime.now().minus({days: 30}).toISODate()
  const dateMax = DateTime.now().toISODate()

  const [fetchingEvents, setFetchingEvents] = useState(false)
  const [events, setEvents] = useState<WorkerActivityUpdateEvent[]>([])

  const [timeRangeValue, setTimeRangeValue] = useState([8, 20])
  const [timeRangeStartHour, timeRangeEndHour] = timeRangeValue

  React.useEffect(() => {
    if (fetchingWorkers) {
      apiListWorkers()
        .then(workers => {
          let sortedWorkers = _.sortBy<Worker>(workers, [(o) => o.friendlyName.toLowerCase()])
          setWorkers(sortedWorkers)
          setSelectedWorkers(sortedWorkers.length != 0 ? [sortedWorkers[0]] : [])
          setFetchingWorkers(false)
        }).catch(_ => {
          setWorkers([])
          setFetchingWorkers(false)
        },
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchingWorkers])

  React.useEffect(() => {
    console.log('Fetching events for workers', selectedWorkers)
    if (selectedWorkers.length > 0) {
      setFetchingEvents(true)
      // Fetch events for all workers
      apiListEventsForWorkers(selectedWorkers.map(worker => worker.sid), date)
        .then(events => {
          console.log('events', JSON.stringify(events))
          setEvents(events)
          setFetchingEvents(false)
        }).catch(_ => {
          setWorkers([])
          setFetchingEvents(false)
        },
      )
    } else {
      setEvents([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedWorkers, date])

  const ControlPanel = (props: { disabled?: boolean, hideTimeRangePicker?: boolean }) =>
    <Box>
      <Flex>
        <Box margin='space50' width='size50'>
          <WorkersMultiSelect allWorkers={workers}
                              selectedWorkers={selectedWorkers}
                              setSelectedWorkers={setSelectedWorkers}
                              workersLimit={WORKERS_LIMIT}
                              disabled={!!props.disabled}/>
        </Box>
        <DatePickerComponent value={date}
                             setValue={setDate}
                             dateMin={dateMin}
                             dateMax={dateMax}
                             disabled={props.disabled}/>
      </Flex>
      <TimeRangePicker value={timeRangeValue}
                       setValue={setTimeRangeValue}
                       hidden={props.hideTimeRangePicker}
                       disabled={props.disabled}/>
    </Box>


  if (fetchingWorkers) {
    return <Loading/>
  } else if (selectedWorkers.length == 0) {
    return <ControlPanel hideTimeRangePicker={true}/>
  } else if (fetchingEvents) {
    return (
      <Box>
        <ControlPanel disabled={true}/>
        <Loading/>
      </Box>
    )
  } else {

    const slices = workerActivityUpdateEventToStatusSlice(events, selectedWorkers)

    const timeRangeStartDate = dateAtHour(date, timeRangeStartHour)
    const timeRangeEndDate = dateAtHour(date, timeRangeEndHour)

    const croppedSlices = cropSlicesToRange(slices, timeRangeStartDate, timeRangeEndDate)

    return (
      <Box>
        <ControlPanel/>
        <WorkersTimeline slices={croppedSlices}/>
      </Box>
    )
  }
}

const cropSlicesToRange = (slices: StatusSlice[], rangeStart: DateTime, rangeEnd: DateTime): StatusSlice[] =>
  slices.reduce((acc, next) => {
    if (next.end < rangeStart || next.start > rangeEnd) {
      // slice is out of range
      // console.log('Slice is out of range')
      return acc
    } else {
      // slice is in range
      // console.log('Slice is in range')
      return [
        ...acc,
        new StatusSlice(
          next.workerName,
          next.status,
          next.start < rangeStart ? rangeStart : next.start,
          next.end < rangeEnd ? next.end : rangeEnd),
      ]
    }
  }, new Array<StatusSlice>())

const dateAtHour = (date: string, hour: number) =>
  DateTime.fromISO(date)
    .set({
      hour: hour,
      minute: 0,
      second: 0,
      millisecond: 0,
    })

const Loading = () => <Box top='50%' left='50%' position='fixed'>
  <Spinner size='sizeIcon110' decorative={false} title='Loading'/>
</Box>