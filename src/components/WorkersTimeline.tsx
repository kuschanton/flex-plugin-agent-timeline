import React from 'react'
import {Chart} from 'react-google-charts'
import {StatusSlice} from '../model/StatusSlice'
import {Box} from '@twilio-paste/core/box'

export const WorkersTimeline = (
  props: {
    slices: StatusSlice[]
  },
) => {
  const colours = Array.from(new Set(props.slices.map(slice => statusToColor(slice.status))))

  const options = {
    timeline: {
      // groupByRowLabel: true,
    },
    colors: colours,
  }

  return (
    <Box margin='space50' minWidth='1000px' width='100%'>
      <Chart
        chartType='Timeline'
        data={convertToChartData(props.slices)}
        width='100%'
        height='600px'
        options={options}
      />
    </Box>
  )
}

const convertToChartData = (slices: StatusSlice[]) => {
  let result = [[
    {type: 'string', id: 'Agent Name'},
    {type: 'string', id: 'Status'},
    {type: 'date', id: 'Start'},
    {type: 'date', id: 'End'},
  ],
    ...slices.map(slice => [slice.workerName, slice.status, slice.start, slice.end]),
  ]
  console.log(result)
  return result
}

const statusToColor = (status: String) => {
  switch (status) {
    case 'Offline':
      return '#d4d4d4'
    case 'Available':
      return '#4484f4'
    case 'Break':
      return '#f4b404'
    case 'Unavailable':
      return '#dc4434'
    default:
      return '#242424'
  }
}