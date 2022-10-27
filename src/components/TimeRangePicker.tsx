import {Slider} from '@mui/material'
import {Box} from '@twilio-paste/core/box'
import _ from 'lodash'

export const TimeRangePicker = (
  props: {
    value: number[],
    setValue: ((value: (((prevState: number[]) => number[]) | number[])) => void),
    disabled?: boolean
  },
) => {

  let handleChange = (event: Event, newValue: number | number[]) => props.setValue(newValue as number[])

  return <Box margin='space50' minWidth='1000px' width='100%'>
    <Slider
      getAriaLabel={() => 'Time range'}
      min={0}
      max={24}
      value={props.value}
      onChange={handleChange}
      marks={marks}
      valueLabelDisplay='auto'
      getAriaValueText={(v, i) => v.toString()}
      disabled={!!props.disabled}
    />
  </Box>

}

const marks = _.range(0, 25)
  .map(it => ({value: it, label: `${it}:00`}))