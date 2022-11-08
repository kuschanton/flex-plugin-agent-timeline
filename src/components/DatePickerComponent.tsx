import {Box} from '@twilio-paste/core/box'
import {Button, DatePicker, Flex, Label} from '@twilio-paste/core'
import React from 'react'
import {ChevronLeftIcon} from '@twilio-paste/icons/esm/ChevronLeftIcon'
import {ChevronRightIcon} from '@twilio-paste/icons/esm/ChevronRightIcon'
import {DateTime} from 'luxon'

export const DatePickerComponent = (
  props: {
    value: string,
    setValue: ((value: (((prevState: string) => string) | string)) => void),
    disabled?: boolean
    dateMax: string
    dateMin: string
  },
) => {

  const handleChangeCalendar = (event: any) => {
    props.setValue(event.target.value as string)
  }

  const handleButtonNext = () => {
    props.setValue(
      DateTime.fromISO(props.value)
        .plus({days: 1})
        .toISODate()
    )
  }
  const handleButtonPrev = () => {
    props.setValue(
      DateTime.fromISO(props.value)
        .minus({days: 1})
        .toISODate()
    )
  }

  return <Box margin='space50'>
    <Label htmlFor={'datePicker'} required>
      Select the date (only last 30 days are available)
    </Label>
    <Flex vAlignContent='center'>
      <Box margin='space20' alignContent={'middle'}>
        <Button variant='primary'
                size='icon_small'
                onClick={handleButtonPrev}
                disabled={props.disabled || props.value === props.dateMin}>
          <ChevronLeftIcon decorative={false} title='Previous date'/>
        </Button>
      </Box>
      <Box margin='space20' width={'200px'}>
        <DatePicker
          required
          id={'datePicker'}
          onChange={handleChangeCalendar}
          value={props.value}
          max={props.dateMax}
          min={props.dateMin}
          disabled={props.disabled}
        />
      </Box>
      <Box margin='space20'>
        <Button variant='primary'
                size='icon_small'
                onClick={handleButtonNext}
                disabled={props.disabled || props.value === props.dateMax}>
          <ChevronRightIcon decorative={false} title='Next date'/>
        </Button>
      </Box>
    </Flex>
  </Box>
}