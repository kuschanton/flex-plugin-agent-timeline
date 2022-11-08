import {Box} from '@twilio-paste/core/box'
import {MultiselectCombobox, Text} from '@twilio-paste/core'
import React from 'react'
import {Worker} from '../model/Worker'

const SampleEmptyState = () => (
  <Box paddingY='space40' paddingX='space50'>
    <Text as='span' fontStyle='italic'>
      No results found
    </Text>
  </Box>
)

export const WorkersMultiSelect = (
  props: {
    allWorkers: Worker[],
    selectedWorkers: Worker[],
    setSelectedWorkers: ((value: (((prevState: Worker[]) => Worker[]) | Worker[])) => void),
    workersLimit: number,
    disabled: boolean
  },
) => {
  const [inputValue, setInputValue] = React.useState('')
  const filteredWorkers = React.useMemo(
    () => getFilteredItems(props.allWorkers, inputValue), [inputValue],
  )

  const getHelpText = () => {
    if (props.selectedWorkers.length == 0) {
      return 'Please select at least one agent'
    } else if (props.selectedWorkers.length > props.workersLimit) {
      return `You can select only up to ${props.workersLimit} agents. If more selected only first ${props.workersLimit} will be shown`
    } else {
      return 'Please select at least one agent'
    }
  }

  const onSelectedItemsChange = (selectedItems: string[]) => {
    let selectedItemsSet = new Set<string>(selectedItems)
    let selectedWorkers = props.allWorkers.filter(it => selectedItemsSet.has(it.friendlyName))
    props.setSelectedWorkers(selectedWorkers)
  }

  const onInputValueChange = ({inputValue: newInputValue = ''}) => {
    setInputValue(!!newInputValue ? newInputValue : '')
  }

  return (<MultiselectCombobox
    required
    hasError={props.selectedWorkers.length == 0 || props.selectedWorkers.length > props.workersLimit}
    labelText='Choose Agent(s)'
    selectedItemsLabelText='Selected Agents'
    helpText={getHelpText()}
    items={filteredWorkers.map(it => it.friendlyName)}
    initialSelectedItems={props.selectedWorkers.map(it => it.friendlyName)}
    emptyState={SampleEmptyState}
    onInputValueChange={onInputValueChange}
    onSelectedItemsChange={onSelectedItemsChange}
    disabled={props.disabled}
  />)
}

const getFilteredItems = (workers: Worker[], inputValue: string) =>
  workers.filter(worker => worker.friendlyName.toLowerCase().includes(inputValue.toLowerCase()))